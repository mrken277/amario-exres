const fse = require("fs-extra");
const execa = require("execa");
const start = require('./start');
const { filePath, log } = require('./utils');

module.exports = async function() {
  try {
    log('Stopping pm2 processes ...');

    // stop services
    await execa("pm2", ["delete", 'all']).stdout.pipe(process.stdout);

    log('Removing old build ...');

    await fse.remove(filePath('build'));

    await start();
  } catch (e) {
    console.log(e);
  }
};
