const kill = require('kill-port')
const fse = require("fs-extra");
const execa = require("execa");
const start = require('./start');
const { filePath } = require('./utils');

module.exports = async function() {
  try {
    // stop services
    execa("pm2", ["delete", 'all']).stdout.pipe(process.stdout);

    const configs = await fse.readJSON(filePath('configs.json'));
    const uiConfigs = configs.UI || {};

    // kill ui process
    await kill(uiConfigs.PORT);

    await fse.remove(filePath('build'));

    await start();
  } catch (e) {
    console.log(e);
  }
};
