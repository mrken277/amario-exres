export default {
    routes: [
        {
            method: "POST",
            path: "/test",
            handler: async ({ req, models }) => {
                console.log('sssss', await models.MyPlugin.find());
            }
        }
    ]
}