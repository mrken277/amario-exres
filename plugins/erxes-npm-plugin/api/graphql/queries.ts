const chalk = require('chalk');

const myPluginQueries = [
  {
    name: 'myPlugin2List',
    handler: async (_root, _args, { models }) => {
      console.log(chalk.blue('Hello world!'));

      return models.MyPlugin.find();
    }
  }
]

export default myPluginQueries;