'use strict';

const { resolve, join } = require('path');

const chalk = require('chalk');
const fs = require('fs');
const fse = require('fs-extra');
const commander = require('commander');
const execa = require('execa');

const packageJson = require('./package.json');

const program = new commander.Command(packageJson.name);

let projectName;

program
  .version(packageJson.version)
  .arguments('<directory>')
  .option('--debug', 'Display database connection error')
  .description('create a new application')
  .action(directory => {
    projectName = directory;
  })
  .parse(process.argv);


if (projectName === undefined) {
  console.error('Please specify the <directory> of your project');

  process.exit(1);
}

const stopProcess = (message) => {
  if (message) console.error(message);

  process.exit(1);
};

const generate = async () => {
  const rootPath = resolve(projectName);

  if (await fse.exists(rootPath)) {
    const stat = await fse.stat(rootPath);

    if (!stat.isDirectory()) {
      stopProcess(
        `⛔️ ${chalk.green(
          rootPath
        )} is not a directory. Make sure to create a Erxes application in an empty directory.`
      );
    }

    const files = await fse.readdir(rootPath);

    if (files.length > 0) {
      stopProcess(
        `⛔️ You can only create a Erxes app in an empty directory.\nMake sure ${chalk.green(
          rootPath
        )} is empty.`
      );
    }
  }

  await fs.promises.mkdir(rootPath);

  // create configs.json
  await fse.writeJSON(
    join(rootPath, 'configs.json'),
    {
      "JWT_TOKEN_SECRET": "token",
      "MONGO_URL": "mongodb://localhost",
      "DOMAIN": "http://localhost:3000",
      "UI": {
          "PORT": 3000
      },
      "API": {
          "PORT": 3300
      }
    },
    {
      spaces: 2,
    }
  );

  // create package.json
  await fse.writeJSON(
    join(rootPath, 'package.json'),
    {
      "name": projectName,
      "private": true,
      "version": '0.1.0',
      "scripts": {
        "start": 'erxes start',
      },
      "dependencies": {
        "erxes": "^0.1.5",
      },
    },
    {
      spaces: 2,
    }
  );

  execa('yarn', ['install'], { cwd: rootPath}).stdout.pipe(process.stdout);
}

generate().catch((e) => {
  console.log(e)
});