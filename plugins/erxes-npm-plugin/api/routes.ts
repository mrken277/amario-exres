export default {
    routes: [
        {
            method: "POST",
            path: "/test2",
            handler: async ({ _req, models }) => {
                console.log('sssss', await models.MyPlugin.find());
            }
        }
    ]
}