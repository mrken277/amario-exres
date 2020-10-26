const myPluginMutations = [
  {
    name: 'myPlugin2Create',
    handler: async (_root, _args, { models }) => {
      return models.MyPlugin.create({
          name: _args.name,
          description: _args.description
      });
    }
  }
]

export default myPluginMutations;