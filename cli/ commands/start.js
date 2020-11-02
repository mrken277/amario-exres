const fse = require("fs-extra");
const { filePath, downloadLatesVersion, startApi, startUI, log } = require('./utils');

module.exports = async function() {
  try {
    // download the latest build
    await downloadLatesVersion();

    // create configs file
    const configs = await fse.readJSON(filePath('configs.json'));

    startApi(configs);
    startUI(configs);

    log('Done  ...');
  } catch (e) {
    console.log(e);
  }
};