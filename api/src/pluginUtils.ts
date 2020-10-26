import * as fs from 'fs';
import * as path from 'path';

export const execInEveryPlugin = (callback) => {
    const pluginsPath = path.resolve(__dirname, '../../plugins');

    if (fs.existsSync(pluginsPath)) {
        fs.readdir(pluginsPath, (_error, plugins) => {
            const pluginsCount = plugins.length;

            plugins.forEach((plugin, index) => {
                let routes = [];
                let models = [];
                let graphqlQueries = [];
                let graphqlMutations = [];

                const graphqlSchema = {
                    types: '',
                    queries: '',
                    mutations: '',
                }

                const routesPath = `${pluginsPath}/${plugin}/api/routes.js`
                const graphqlSchemaPath = `${pluginsPath}/${plugin}/api/graphql/schema.js`
                const graphqlQueriesPath = `${pluginsPath}/${plugin}/api/graphql/queries.js`
                const graphqlMutationsPath = `${pluginsPath}/${plugin}/api/graphql/mutations.js`
                const modelsPath = `${pluginsPath}/${plugin}/api/models.js`

                if (fs.existsSync(routesPath)) {
                    routes = require(routesPath).default.routes;
                }

                if (fs.existsSync(modelsPath)) {
                    models = require(modelsPath).default;
                }

                if (fs.existsSync(graphqlQueriesPath)) {
                    graphqlQueries = require(graphqlQueriesPath).default;
                }

                if (fs.existsSync(graphqlMutationsPath)) {
                    graphqlMutations = require(graphqlMutationsPath).default;
                }

                if (fs.existsSync(graphqlSchemaPath)) {
                    const { types, queries, mutations } = require(graphqlSchemaPath);

                    if (types) {
                        graphqlSchema.types = types;
                    }

                    if (queries) {
                        graphqlSchema.queries = queries;
                    }

                    if (mutations) {
                        graphqlSchema.mutations = mutations;
                    }
                }
                
                callback({
                    isLastIteration: pluginsCount === index + 1,
                    routes,
                    graphqlSchema,
                    graphqlQueries,
                    graphqlMutations,
                    models
                })
            })
        })
    }
}