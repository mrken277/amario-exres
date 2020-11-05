const chalk = require('chalk');
const execa = require("execa");
const fs = require('fs');
const fse = require("fs-extra");
const { resolve } = require("path");
const exec = require('child_process').exec;

const filePath = (pathName) => {
  if (pathName) {
    return resolve(process.cwd(), pathName);
  }

  return resolve(process.cwd());
}

const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if(error !== null) {
        return reject(error);
      }

      console.log(stdout);
      console.log(stderr);

      return resolve('done')
    });
  });
}

const execCurl = (url, output) => {
  return execCommand(`curl -L ${url} --output ${output}`);
}

const log = (msg, color='green') => {
  console.log(chalk[color](msg));
}

module.exports.log = log;

module.exports.filePath = filePath;

module.exports.downloadLatesVersion = async () => {
  log('Downloading erxes ...');

  // download the latest build
  await execCurl('https://api.github.com/repos/battulgadavaajamts/erxes/releases/latest', 'gitInfo.json')

  const gitInfo = await fse.readJSON(filePath('gitInfo.json'));

  await execCurl(`https://github.com/battulgadavaajamts/erxes/releases/download/${gitInfo.tag_name}/erxes-${gitInfo.tag_name}.tar.gz`, 'build.tar.gz')

  process.chdir(filePath());

  log('Extracting tar ...');

  await execCommand(`tar -xf build.tar.gz`)

  log('Removing temp files ...');

  await fse.remove(filePath('build.tar.gz'));
}

const runCommand = (command, args, options) => {
  return execa(command, args, options).stdout.pipe(process.stdout);
}

module.exports.startServices = async (configs) => {
  log('Starting services using pm2 ...');

  const {
    JWT_TOKEN_SECRET,
    DOMAIN,
    API_DOMAIN,
    WIDGETS_DOMAIN,
    INTEGRATIONS_API_DOMAIN,
    MONGO_URL,
    ELASTICSEARCH_URL,
    ELK_SYNCER,

    RABBITMQ_HOST,
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PASSWORD
  } = configs;

  const optionalDbConfigs = {};

  if (RABBITMQ_HOST) {
    optionalDbConfigs.RABBITMQ_HOST = RABBITMQ_HOST;
  }

  if (REDIS_HOST) {
    optionalDbConfigs.REDIS_HOST = REDIS_HOST;
    optionalDbConfigs.REDIS_PORT = REDIS_PORT;
    optionalDbConfigs.REDIS_PASSWORD = REDIS_PASSWORD;
  }

  const commonEnv = {
    NODE_ENV: 'production',
    JWT_TOKEN_SECRET: JWT_TOKEN_SECRET || '',
    MONGO_URL: `${MONGO_URL || ''}/erxes`,
    MAIN_APP_DOMAIN: DOMAIN,
    WIDGETS_DOMAIN: WIDGETS_DOMAIN,
    INTEGRATIONS_API_DOMAIN: INTEGRATIONS_API_DOMAIN,
    ...configs.API || {}
  }

  const apps = [
    {
      name: 'api',
      script: filePath('build/api'),
      env: {
        ...commonEnv,
        ...optionalDbConfigs,
        DEBUG: 'erxes-api:*', 
      }
    },
    {
      name: 'cronjobs',
      script: filePath('build/api/cronJobs'),
      env: {
        ...commonEnv,
        PROCESS_NAME: 'crons',
        ...optionalDbConfigs,
        DEBUG: 'erxes-crons:*', 
      }
    },
    {
      name: 'workers',
      script: filePath('build/api/workers'),
      env: {
        ...commonEnv,
        ...optionalDbConfigs,
        DEBUG: 'erxes-workers:*', 
      }
    },
    {
      name: 'integrations',
      script: filePath('build/integrations'),
      env: {
        NODE_ENV: 'production',
        DEBUG: 'erxes-integrations:*',
        DOMAIN: INTEGRATIONS_API_DOMAIN,
        MAIN_APP_DOMAIN: DOMAIN,
        MAIN_API_DOMAIN: API_DOMAIN,
        MONGO_URL: `${MONGO_URL || ''}/erxes_integrations`,
        ...optionalDbConfigs,
        ...configs.INTEGRATIONS || {}
      }
    },
    {
      name: 'engages',
      script: filePath('build/engages'),
      env: {
        NODE_ENV: 'production',
        DEBUG: 'erxes-engages:*',
        DOMAIN: INTEGRATIONS_API_DOMAIN,
        MAIN_API_DOMAIN: API_DOMAIN,
        MONGO_URL: `${MONGO_URL || ''}/erxes_engages`,
        ...optionalDbConfigs,
        ...configs.ENGAGES || {}
      }
    },
    {
      name: 'logger',
      script: filePath('build/logger'),
      env: {
        NODE_ENV: 'production',
        DEBUG: 'erxes-logs:*',
        DOMAIN: INTEGRATIONS_API_DOMAIN,
        MAIN_API_DOMAIN: API_DOMAIN,
        MONGO_URL: `${MONGO_URL || ''}/erxes_logger`,
        ...optionalDbConfigs,
        ...configs.LOGGER || {}
      }
    },
    {
      name: 'email-verifier',
      script: filePath('build/email-verifier'),
      env: {
        NODE_ENV: 'production',
        DEBUG: 'erxes-email-verifier:*',
        MONGO_URL: `${MONGO_URL || ''}/erxes_email_verifier`,
        ...configs.EMAIL_VERIFIER || {}
      }
    }
  ];

  if (ELK_SYNCER) {
    log('Starting elkSyncer ...');

    await runCommand('apt', ['install', '-y', 'python3-pip']);
    await runCommand('pip3', ['install', '-y', '-r', 'build/elkSyncer/requirements.txt']);

    apps.push({
      name: 'elkSyncer',
      script: filePath('build/elkSyncer/main.py'),
      interpreter: '/usr/bin/python3',
      env: {
        MONGO_URL,
        ELASTICSEARCH_URL
      }
    })
  }

  const uiConfigs = configs.UI || {};
  const subscriptionsUrl = `${API_DOMAIN.includes('https') ? 'wss' : 'ws'}//${API_DOMAIN}/subscriptions`;

  if (uiConfigs.disableServe) {
    log('Default serve is disabled. Please serve using services like nginx, aws s3 ...', 'yellow');
  } else {
    await fs.promises.writeFile(filePath('build/ui/js/env.js'), `
      window.env = {
        NODE_ENV: "production",
        REACT_APP_API_URL: "${API_DOMAIN}",
        REACT_APP_API_SUBSCRIPTION_URL: "${subscriptionsUrl}",
        REACT_APP_CDN_HOST: "${WIDGETS_DOMAIN}"
      }
    `);

    apps.push({
      name: 'ui',
      script: 'serve',
      env: {
        PM2_SERVE_PATH: filePath('build/ui'),
        PM2_SERVE_PORT: uiConfigs.PORT,
        PM2_SERVE_SPA: 'true',
      }
    })
  }

  apps.push({
    name: 'widgets',
    script: filePath('build/widgets/dist'),
    env: {
      ...configs.WIDGETS || {},
      NODE_ENV: 'production',
      ROOT_URL: WIDGETS_DOMAIN,
      API_URL: API_DOMAIN,
      API_SUBSCRIPTIONS_URL: subscriptionsUrl,
    }
  });

  // create ecosystem
  await fse.writeFile(
    filePath('ecosystem.config.js'),
    `
      module.exports = {
        apps: ${JSON.stringify(apps)}
      }
    `
  );

  return runCommand("pm2", ["start", filePath('ecosystem.config.js')]);
}