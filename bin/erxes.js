#!/usr/bin/env node
'use strict';

const _ = require('lodash');

const program = require('commander');
const packageJSON = require('../package.json');
const buildCmd = require('../ commands/build');
const developCmd = require('../ commands/develop');

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

// `$ erxes develop`
program
  .command('develop')
  .description('Run your Erxes application in development mode')
  .action(developCmd);

// `$ erxes build`
program
  .command('build')
  .description('Build your Erxes application in production mode')
  .action(buildCmd);

program.parse(process.argv);