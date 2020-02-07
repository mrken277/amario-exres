const notificationsModules = `
  query notificationsModules {
    notificationsModules
  }
`;

const notificationsGetConfigurations = `
  query notificationsGetConfigurations {
    notificationsGetConfigurations {
      _id
      notifType
      isAllowed
    }
  }
`;

export default {
  notificationsModules,
  notificationsGetConfigurations
};
