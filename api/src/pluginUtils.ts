import * as fs from 'fs';
import * as mongoose from 'mongoose';
import * as path from 'path';
import { can, registerModule } from './data/permissions/utils';
import { checkLogin } from './data/permissions/wrappers';

export const pluginsRabbitMQ: {
  consumers: any;
  allModels: any;
  allConstants: any;
} = {
  consumers: null,
  allModels: null,
  allConstants: null
};

export const execInEveryPlugin = (callback) => {
  const pluginsPath = path.resolve(__dirname, '../../plugins');

  if (fs.existsSync(pluginsPath)) {
    fs.readdir(pluginsPath, (_error, plugins) => {
      const pluginsCount = plugins.length;

      plugins.forEach((plugin, index) => {
        let routes = [];
        let messageBrokers = [];
        let models = [];
        let graphqlQueries = [];
        let graphqlResolvers = [];
        let graphqlMutations = [];
        let constants = {};

        const graphqlSchema = {
          types: '',
          queries: '',
          mutations: '',
        }

        const ext = process.env.NODE_ENV === 'production' ? 'js' : 'ts';

        const permissionsPath = `${pluginsPath}/${plugin}/api/permissions.${ext}`
        const routesPath = `${pluginsPath}/${plugin}/api/routes.${ext}`
        const messageBrokersPath = `${pluginsPath}/${plugin}/api/messageBrokers.${ext}`
        const graphqlSchemaPath = `${pluginsPath}/${plugin}/api/graphql/schema.${ext}`
        const graphqlQueriesPath = `${pluginsPath}/${plugin}/api/graphql/queries.${ext}`
        const graphqlResolversPath = `${pluginsPath}/${plugin}/api/graphql/resolvers.${ext}`
        const graphqlMutationsPath = `${pluginsPath}/${plugin}/api/graphql/mutations.${ext}`
        const modelsPath = `${pluginsPath}/${plugin}/api/models.${ext}`
        const constantsPath = `${pluginsPath}/${plugin}/api/constants.${ext}`

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

        if (fs.existsSync(messageBrokersPath)) {
          messageBrokers = require(messageBrokersPath).default;
        }

        if (fs.existsSync(modelsPath)) {
          models = require(modelsPath).default;
        }

        if (fs.existsSync(constantsPath)) {
          constants = require(constantsPath).default;
        }

        if (fs.existsSync(graphqlResolversPath)) {
          graphqlResolvers = require(graphqlResolversPath).default;
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
          messageBrokers,
          graphqlSchema,
          graphqlResolvers,
          graphqlQueries,
          graphqlMutations,
          models,
          constants
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
  const rqPlugins = {}

  execInEveryPlugin(async ({ constants, isLastIteration, graphqlSchema, graphqlResolvers, graphqlQueries, graphqlMutations, routes, models, messageBrokers }) => {
    const allModels = require('./db/models');
    const defConstants = require('./db/models/definitions/constants');
    const dataConstants = require('./data/constants')

    const allConstants = { ...dataConstants, ...defConstants }

    routes.forEach(route => {
      app[route.method.toLowerCase()](route.path, (req, res) => {
        return res.send(route.handler({ req, models: allModels, constants: allConstants }));
      })
    });

    if (models.length) {
      models.forEach(model => {
        allModels[model.name] = mongoose.model(model.name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase(), model.schema);
      });
    }

    if (constants.length) {
      for (const key of Object.keys(constants)) {
        let all = [];
        if (allConstants[key] && allConstants[key].ALL) {
          all = allConstants[key].ALL.concat(constants[key].ALL);
        }
        allConstants[key] = { ...allConstants[key], ...constants[key], ...{ ALL: all } };
      }
    }

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
        constants: allConstants,
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

    if (graphqlResolvers) {
      for (const resolver of graphqlResolvers) {
        if (!Object.keys(resolvers).includes(resolver.type)) {
          resolvers[resolver.type] = {}
        }
        resolvers[resolver.type][resolver.field] = (_root, _args, context) => {
          return resolver.handler(_root, _args, generateCtx(context));
        }
      }
    }

    if (messageBrokers.length) {
      messageBrokers.forEach(async (mbroker) => {
        if (!Object.keys(rqPlugins).includes(mbroker.channel)) {
          rqPlugins[mbroker.channel] = {}
        }
        rqPlugins[mbroker.channel] = mbroker
      });
    }

    if (isLastIteration) {
      pluginsRabbitMQ.allModels = allModels
      pluginsRabbitMQ.allConstants = allConstants
      pluginsRabbitMQ.consumers = rqPlugins
      return resolve({ types, queries, mutations })
    }
  });
});