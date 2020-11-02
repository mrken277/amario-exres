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

module.exports.filePath = filePath;

module.exports.downloadLatesVersion = async () => {
  // download the latest build
  await fse.copy(
    resolve("/Users/batamar/Downloads/build.tar"),
    filePath('build.tar')
  );

  process.chdir(filePath());

  await tar.x({ file: "build.tar" });

  await fse.remove(filePath('build.tar'));
}

module.exports.startApi = (configs) => {
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
  const uiConfigs = configs.UI || {};

  return execa("serve", ['-s', '-p', uiConfigs.PORT, filePath('build/ui')]).stdout.pipe(process.stdout);
}