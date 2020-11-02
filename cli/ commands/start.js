const { resolve } = require("path");

const fse = require("fs-extra");
const tar = require("tar");
const execa = require("execa");

const filePath = (pathName) => {
  if (pathName) {
    return resolve(process.cwd(), pathName);
  }

  return resolve(process.cwd());
}

module.exports = async function() {
  try {
    // download the latest build
    await fse.copy(
      resolve("/Users/batamar/Downloads/build.tar"),
      filePath('build.tar')
    );

    process.chdir(filePath());

    await tar.x({ file: "build.tar" });

    await fse.remove(filePath('build.tar'));

    const configs = await fse.readJSON(filePath('configs.json'));
    const uiConfigs = configs.UI || {};

    execa("pm2", ["start", filePath('build/api')], {
      env: {
        JWT_TOKEN_SECRET: configs.JWT_TOKEN_SECRET || '',
        MONGO_URL: `${configs.MONGO_URL || ''}/erxes`,
        MAIN_APP_DOMAIN: configs.DOMAIN,
        ...configs.API || {}
      }
    }).stdout.pipe(process.stdout);

    execa("serve", ['-s', '-p', uiConfigs.PORT, filePath('build/ui')]).stdout.pipe(process.stdout);
  } catch (e) {
    console.log(e);
  }
};
