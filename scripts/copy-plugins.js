var path = require('path');
var { resolve } = require("path");
var fs = require('fs-extra');
const exec = require('child_process').exec;
var packageJson = require('../package.json');

const getPkgPath = name => path.dirname(require.resolve(`${name}/package.json`));

const packageNames = Object.keys(packageJson.dependencies);

const filePath = (pathName) => {
  if (pathName) {
    return resolve(process.cwd(), pathName);
  }

  return resolve(process.cwd());
}

const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if(error !== null) {
        return reject(error);
      }

      console.log(stdout);
      console.log(stderr);

      return resolve('done')
    });
  });
}

for (const packageName of packageNames) {
    if (packageName.startsWith('erxes')) {
        const pkgFilePath = getPkgPath(packageName);

        fs.copy(path.resolve(pkgFilePath), path.resolve(__dirname, '../plugins', packageName))
    }

    // creating plugin.js
    const pluginsPath = path.resolve(__dirname, '../plugins');

    fs.readdir(pluginsPath, (_error, pluginNames) => {
        let pluginImports = '';

        for (const pluginName of pluginNames) {
            if (pluginName === '.DS_Store' || !fs.existsSync(filePath(`plugins/${pluginName}/ui`))) {
                continue;
            }

            pluginImports = `
                ${pluginImports}
                '${pluginName}': require('../../plugins/${pluginName}/ui').default,
            `;

            fs.readJSON(filePath(`plugins/${pluginName}/ui/packages.json`))
              .then((json) => {
                  var promises = [];

                  for (const name of Object.keys(json)) {
                      process.chdir(filePath('ui'));
                      promises.push(execCommand(`yarn add ${name}@${json[name]}`));
                  }

                  return Promise.all(promises);
              })
              .catch((e) => {
                if (!(e.message.includes("no such file") || e.message.includes('not a directory'))) {
                  console.log(e.message);
                }
              });
        }

        fs.writeFileSync(path.resolve(__dirname, '../ui/src/plugins.ts'), `
            export default {
                ${pluginImports}
            }
        `)
    });
}