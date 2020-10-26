const myPluginSchema = {
  createdAt: { type: Date, label: "Created at" },
  name: { type: String, label: "Name" },
  description: {
    type: String,
    optional: true,
    label: "Description",
  },
  integrationIds: { type: [String], label: "Integrations" },
  memberIds: { type: [String], label: "Members" },
  userId: { type: String, label: "Created by" },
};

export default [
  {
    name: 'MyPlugin',
    schema: myPluginSchema,
  },
];