export const types = `
  type MyPlugin {
      name: String
      description: String
  }
`
export const queries = `
  myPluginList(page: Int, perPage: Int, status: String): [MyPlugin]
`

export const mutations = `
  myPluginCreate(name: String, description: String): MyPlugin
`