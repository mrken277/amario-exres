const kill = require('kill-port')
const fse = require("fs-extra");
const execa = require("execa");
const start = require('./start');
const { filePath, log } = require('./utils');

module.exports = async function() {
  try {
    log('Stopping pm2 processes ...');

    // stop services
    execa("pm2", ["delete", 'all']).stdout.pipe(process.stdout);

    const configs = await fse.readJSON(filePath('configs.json'));
    const uiConfigs = configs.UI || {};

    log('Stopping serve (ui) process ...');

    // kill ui process
    await kill(uiConfigs.PORT);

    log('Removing old build ...');

    await fse.remove(filePath('build'));

    await start();
  } catch (e) {
    console.log(e);
  }
};
