const path = require('path');
const shell = require('shelljs');
const fs = require('fs-extra');

const build = async function() {
  // build api
  process.chdir(path.resolve(__dirname, '..', 'api'));
  await shell.exec('yarn install --production');
  await shell.exec('yarn build');
  await shell.exec('cp -rf src/private ../build/api');
  await shell.exec('cp -rf node_modules ../build/api');
  await shell.exec('mkdir -p .../build/api/src/ && cp -rf src/initialData ../build/api/src/');

  // build integrations
  process.chdir(path.resolve(__dirname, '..', 'integrations'));
  await shell.exec('yarn install --production');
  await shell.exec('yarn build');
  await shell.exec('cp -rf node_modules ../build/integrations');

  // build engages
  process.chdir(path.resolve(__dirname, '..', 'engages-email-sender'));
  await shell.exec('yarn install --production');
  await shell.exec('yarn build');
  await shell.exec('cp -rf node_modules ../build/engages');

  // build email verifier
  process.chdir(path.resolve(__dirname, '..', 'email-verifier'));
  await shell.exec('yarn install --production');
  await shell.exec('yarn build');
  await shell.exec('cp -rf node_modules ../build/email-verifier');

  // build logger
  process.chdir(path.resolve(__dirname, '..', 'logger'));
  await shell.exec('yarn install --production');
  await shell.exec('yarn build');
  await shell.exec('cp -rf node_modules ../build/logger');

  // build ui
  process.chdir(path.resolve(__dirname, '..', 'ui'));
  await shell.exec('yarn install --production');
  await shell.exec('yarn build');

  fs.move(path.resolve(__dirname, '..', 'ui/build'), path.resolve(__dirname, '..', 'build/ui'));

  // build widgets
  process.chdir(path.resolve(__dirname, '..', 'widgets'));
  await shell.exec('yarn install --production');
  await shell.exec('yarn build');

  fs.copy(path.resolve(__dirname, '..', 'widgets'), path.resolve(__dirname, '..', 'build/widgets'));
};

build().catch((e) => {
  console.log(e.message)
});