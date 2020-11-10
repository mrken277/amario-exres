export default {
  routes: [
    {
      method: "POST",
      path: "/test",
      handler: async ({ _req, models }) => {
        console.log('sssss', await models.Cars.find());
      }
    }
  ]
}