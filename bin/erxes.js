#!/usr/bin/env node
'use strict';

const _ = require('lodash');

const program = require('commander');
const packageJSON = require('../package.json');
const buildCmd = require('../ commands/build');
const startUICmd = require('../ commands/start-ui');
const startAPICmd = require('../ commands/start-api');

/**
 * Normalize version argument
 *
 * `$ erxes -v`
 * `$ erxes -V`
 * `$ erxes --version`
 * `$ erxes version`
 */

program.allowUnknownOption(true);

// Expose version.
program.version(packageJSON.version, '-v, --version');

// Make `-v` option case-insensitive.
process.argv = _.map(process.argv, arg => {
  return arg === '-V' ? '-v' : arg;
});

// `$ erxes version` (--version synonym)
program
  .command('version')
  .description('output your version of Erxes')
  .action(() => {
    console.log(packageJSON.version);
  });

// `$ start erxes ui`
program
  .command('start-ui')
  .description('Run your Erxes ui in development mode')
  .action(startUICmd);

// `$ start erxes api`
program
  .command('start-api')
  .description('Run your Erxes api in development mode')
  .action(startAPICmd);

// `$ erxes build`
program
  .command('build')
  .description('Build your Erxes application in production mode')
  .action(buildCmd);

program.parse(process.argv);