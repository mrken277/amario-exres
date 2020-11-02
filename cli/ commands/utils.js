const chalk = require('chalk');
const execa = require("execa");
const tar = require("tar");
const fse = require("fs-extra");
const { resolve } = require("path");

const filePath = (pathName) => {
  if (pathName) {
    return resolve(process.cwd(), pathName);
  }

  return resolve(process.cwd());
}

const log = (msg) => {
  console.log(chalk.green(msg));
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

module.exports.startApi = (configs) => {
  log('Starting api using pm2 ...');

  return execa("pm2", ["start", filePath('build/api')], {
    env: {
      JWT_TOKEN_SECRET: configs.JWT_TOKEN_SECRET || '',
      MONGO_URL: `${configs.MONGO_URL || ''}/erxes`,
      MAIN_APP_DOMAIN: configs.DOMAIN,
      ...configs.API || {}
    }
  }).stdout.pipe(process.stdout);
}

module.exports.startUI = (configs) => {
  log('Starting ui using serve ...');

  const uiConfigs = configs.UI || {};

  return execa("serve", ['-s', '-p', uiConfigs.PORT, filePath('build/ui')]).stdout.pipe(process.stdout);
}