const path = require('path');
const shell = require('shelljs');

module.exports = async function() {
  // run ui
  process.chdir(path.resolve(__dirname, '..', 'ui'));
  await shell.exec('yarn install');
  await shell.exec('yarn start');
};