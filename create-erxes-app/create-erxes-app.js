'use strict';

const { resolve, join } = require('path');
const { createInterface } = require('readline');

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

  let maindomain = 'http://localhost:3000';
  let apiDomain = 'http://localhost:3300';
  let integrationsApiDomain = 'http://localhost:3300';
  let widgetsDomain = 'http://localhost:3400';

  if (domain !== 'localhost') {
    maindomain = domain;
    apiDomain = `${domain}/api`;
    integrationsApiDomain = `${domain}/integrations`;
    widgetsDomain = `${domain}/widgets`;
  }

  const configs = {
    "JWT_TOKEN_SECRET": Math.random().toString(),
    "MONGO_URL": "mongodb://localhost",
    "DOMAIN": maindomain,
    "API_DOMAIN": apiDomain,
    "INTEGRATIONS_API_DOMAIN": integrationsApiDomain,
    "WIDGETS_DOMAIN": widgetsDomain,
    "UI": { "PORT": 3000 },
    "API": {
        "PORT": 3300,
        "PORT_WORKERS": 3700,
        "PORT_CRONS": 3600
    },
    "WIDGETS": { "PORT": 3200 },
    "INTEGRATIONS": { "PORT": 3400 },
    "LOGGER": { "PORT": 3800 },
    "ENGAGES": { "PORT": 3900 },
    "EMAIL_VERIFIER": { "PORT": 4100 }
  };

  if (rabbitmqHost) {
    configs.RABBITMQ_HOST = rabbitmqHost;
  }

  if (redisHost) {
    configs.REDIS_HOST = redisHost;
    configs.REDIS_PORT = redisPort;
    configs.REDIS_PASSWORD = redisPassword;
  }

  // create configs.json
  await fse.writeJSON(
    join(rootPath, 'configs.json'),
    configs,
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
        "update": 'erxes update'
      },
      "dependencies": {
        "erxes": "0.1.10"
      },
    },
    {
      spaces: 2,
    }
  );

  execa('yarn', ['install'], { cwd: rootPath}).stdout.pipe(process.stdout);
}

let domain = 'localhost';
let rabbitmqHost;
let redisHost;
let redisPort=6379;
let redisPassword='';

const readline = createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (question) => {
  return new Promise((resolve) => {
    readline.question(question, (answer) => {
      return resolve(answer);
    });
  });
}

module.exports = async function() {
  const inputDomain = await askQuestion('Please enter your domain (localhost): ')

  if (inputDomain) {
    domain = inputDomain;
  }

  const rabbitmqHostInput = await askQuestion('Are you using rabbitmq then enter rabbitmq host (optional): ')

  if (rabbitmqHostInput) {
    rabbitmqHost = rabbitmqHostInput;
  }

  const redisHostInput = await askQuestion('Are you using redis then enter redis host (optional): ')

  if (redisHostInput) {
    redisHost = redisHostInput;

    const redisPortInput = await askQuestion('Redis port (6379): ')

    if (redisPortInput) {
      redisPort = redisPortInput;
    }

    const redisPasswordInput = await askQuestion('Redis password (optional): ')

    if (redisPasswordInput) {
      redisPassword = redisPasswordInput;
    }
  }

  readline.close();

  await generate();
}();