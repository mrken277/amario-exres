const fse = require("fs-extra");
const { filePath, downloadLatesVersion, startServices, log } = require('./utils');

module.exports = async function(program) {
  try {
    if (!program || !program.ignoreDownload) {
      // download the latest build
      await downloadLatesVersion();
    }

    // create configs file
    const configs = await fse.readJSON(filePath('configs.json'));

    await startServices(configs);

    log('Done  ...');
  } catch (e) {
    console.log(e);
  }
};