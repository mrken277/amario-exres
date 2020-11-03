const chalk = require('chalk');
const execa = require("execa");
const tar = require("tar");
const fs = require('fs');
const fse = require("fs-extra");
const { resolve } = require("path");

const filePath = (pathName) => {
  if (pathName) {
    return resolve(process.cwd(), pathName);
  }

  return resolve(process.cwd());
}

const log = (msg, color='green') => {
  console.log(chalk[color](msg));
}

module.exports.log = log;

module.exports.filePath = filePath;

module.exports.downloadLatesVersion = async () => {
  log('Downloading erxes ...');

  // download the latest build
  await fse.copy(
    resolve("/Users/batamar/Downloads/build.tar"),
    filePath('build.tar')
  );

  process.chdir(filePath());

  log('Extracting tar ...');

  await tar.x({ file: "build.tar" });

  log('Removing temp files ...');

  await fse.remove(filePath('build.tar'));
}

const runCommand = (command, args, options) => {
  return execa(command, args, options).stdout.pipe(process.stdout);
}

module.exports.startApi = (configs) => {
  log('Starting main api, workers, crons using pm2 ...');

  const commonEnv = {
    NODE_ENV: 'production',
    JWT_TOKEN_SECRET: configs.JWT_TOKEN_SECRET || '',
    MONGO_URL: `${configs.MONGO_URL || ''}/erxes`,
    MAIN_APP_DOMAIN: configs.DOMAIN,
    WIDGETS_DOMAIN: configs.WIDGETS_DOMAIN,
    INTEGRATIONS_API_DOMAIN: configs.INTEGRATIONS_API_DOMAIN,
    ...configs.API || {}
  }

  runCommand("pm2", ["start", filePath('build/api')], {
    env: {
      ...commonEnv,
      DEBUG: 'erxes-api:*', 
    }
  });

  runCommand("pm2", ["start", filePath('build/api/cronJobs')], {
    env: {
      ...commonEnv,
      PROCESS_NAME: 'crons',
      DEBUG: 'erxes-crons:*', 
    }
  });

  runCommand("pm2", ["start", filePath('build/api/workers')], {
    env: {
      ...commonEnv,
      DEBUG: 'erxes-workers:*', 
    }
  });
}

module.exports.startUI = async (configs) => {
  const uiConfigs = configs.UI || {};

  if (uiConfigs.disableServe) {
    return log('Default serve is disabled. Please serve using services like nginx, aws s3 ...', 'yellow');
  }

  log('Starting ui using serve ...');

  const { API_DOMAIN, WIDGETS_DOMAIN } = configs;

  await fs.promises.writeFile(filePath('build/ui/js/env.js'), `
    window.env = {
      NODE_ENV: "production",
      REACT_APP_API_URL: "${API_DOMAIN}",
      REACT_APP_API_SUBSCRIPTION_URL: "${API_DOMAIN.includes('https') ? 'wss' : 'ws'}//${API_DOMAIN}/subscriptions",
      REACT_APP_CDN_HOST: "${WIDGETS_DOMAIN}"
    }
  `);

  return execa("serve", ['-s', '-p', uiConfigs.PORT, filePath('build/ui')]).stdout.pipe(process.stdout);
}