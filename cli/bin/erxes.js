#!/usr/bin/env node
'use strict';

const _ = require('lodash');

const program = require('commander');
const packageJSON = require('../package.json');
const startCmd = require('../ commands/start');

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

// `$ start erxes`
program
  .command('start')
  .description('Run erxes')
  .action(startCmd);

program.parse(process.argv);