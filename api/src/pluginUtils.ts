import * as fs from 'fs';
import * as mongoose from 'mongoose';
import * as path from 'path';
import { can, registerModule } from './data/permissions/utils';
import { checkLogin } from './data/permissions/wrappers';

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

                const ext = process.env.NODE_ENV === 'production' ? 'js' : 'ts';

                const permissionsPath = `${pluginsPath}/${plugin}/api/permissions.${ext}`
                const routesPath = `${pluginsPath}/${plugin}/api/routes.${ext}`
                const graphqlSchemaPath = `${pluginsPath}/${plugin}/api/graphql/schema.${ext}`
                const graphqlQueriesPath = `${pluginsPath}/${plugin}/api/graphql/queries.${ext}`
                const graphqlMutationsPath = `${pluginsPath}/${plugin}/api/graphql/mutations.${ext}`
                const modelsPath = `${pluginsPath}/${plugin}/api/models.${ext}`

                if (fs.existsSync(permissionsPath)) {
                  registerModule({
                    [plugin]: {
                      name: plugin,
                      description: plugin,
                      actions: require(permissionsPath).default
                    }
                  })
                }

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

const checkPermission = async (actionName, user) => {
  checkLogin(user);

  const allowed = await can(actionName, user);

  if (!allowed) {
    throw new Error('Permission required');
  }
}

export const extendViaPlugins = (app, resolvers, typeDefDetails): Promise<any> => new Promise((resolve) => {
  let { types, queries, mutations } = typeDefDetails;

  execInEveryPlugin(({ isLastIteration, graphqlSchema, graphqlQueries, graphqlMutations, routes, models }) => {
    const allModels = require('./db/models');

    routes.forEach(route => {
      app[route.method.toLowerCase()](route.path, (req, res) => {
        return res.send(route.handler({ req, models: allModels }));
      })
    });

    models.forEach(model => {
      allModels[model.name] = mongoose.model(model.name.toLowerCase(), model.schema);
    });

    if (graphqlSchema.types) {
      types = `
        ${types}
        ${graphqlSchema.types}
      `
    }

    if (graphqlSchema.queries) {
      queries = `
        ${queries}
        ${graphqlSchema.queries}
      `
    }

    if (graphqlSchema.mutations) {
      mutations = `
        ${mutations}
        ${graphqlSchema.mutations}
      `
    }

    const generateCtx = context => {
      return {
        ...context,
        models: allModels,
        checkLogin,
        checkPermission,
      };
    };

    if (graphqlQueries) {
      for (const query of graphqlQueries) {
        resolvers.Query[query.name] = (_root, _args, context) => {
          return query.handler(_root, _args, generateCtx(context))
        }
      }
    }

    if (graphqlMutations) {
      for (const mutation of graphqlMutations) {
        resolvers.Mutation[mutation.name] = (_root, _args, context) => {
          return mutation.handler(_root, _args, generateCtx(context))
        }
      }
    }

    if (isLastIteration) {
      return resolve({ types, queries, mutations })
    }
  });
});