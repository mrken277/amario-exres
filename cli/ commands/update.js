const fse = require("fs-extra");
const execa = require("execa");
const start = require('./start');
const { filePath } = require('./utils');

module.exports = async function() {
  try {
    // stop services
    execa("pm2", ["delete", 'all']).stdout.pipe(process.stdout);

    await fse.remove(filePath('build'));

    await start();
  } catch (e) {
    console.log(e);
  }
};
