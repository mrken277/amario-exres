const path = require('path');
const shell = require('shelljs');

module.exports = async function() {
  // run api
  process.chdir(path.resolve(__dirname, '..', 'api'));

  await shell.exec('yarn install');

  await shell.exec('yarn dev');
};