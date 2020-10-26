var path = require('path');
var fs = require('fs-extra');
var packageJson = require('../package.json');

const getPkgPath = name => path.dirname(require.resolve(`${name}/package.json`));

const packageNames = Object.keys(packageJson.dependencies);

for (const packageName of packageNames) {
    if (packageName.startsWith('erxes')) {
        const pkgFilePath = getPkgPath(packageName);

        fs.copy(path.resolve(pkgFilePath), path.resolve(__dirname, '../plugins', packageName))

        // creating plugin.js
        const pluginsPath = path.resolve(__dirname, '../plugins');

        fs.readdir(pluginsPath, (_error, pluginNames) => {
            let pluginImports = '';

            for (const pluginName of pluginNames) {
                pluginImports = `
                   ${pluginImports}
                  '${pluginName}': require('../../plugins/${pluginName}/ui').default,
                `;
            }

            fs.writeFileSync(path.resolve(__dirname, '../ui/src/plugins.ts'), `
                export default {
                    ${pluginImports}
                }
            `)
        });
    }
}