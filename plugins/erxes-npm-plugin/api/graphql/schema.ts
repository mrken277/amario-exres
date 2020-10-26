export const types = `
  type MyPlugin2 {
      name: String
      description: String
  }
`
export const queries = `
  myPlugin2List(page: Int, perPage: Int, status: String): [MyPlugin2]
`

export const mutations = `
  myPlugin2Create(name: String, description: String): MyPlugin2
`