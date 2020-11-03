const fse = require("fs-extra");
const { filePath, downloadLatesVersion, startBackendServices, startUI, log } = require('./utils');

module.exports = async function() {
  try {
    // download the latest build
    await downloadLatesVersion();

    // create configs file
    const configs = await fse.readJSON(filePath('configs.json'));

    startBackendServices(configs);
    startUI(configs);

    log('Done  ...');
  } catch (e) {
    console.log(e);
  }
};