const usersChangePassword = `
  mutation usersChangePassword(
    $currentPassword: String!
    $newPassword: String!
  ) {
    usersChangePassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
    ) {
      _id
    }
  }
`;

const usersConfigGetNotificationByEmail = `
  mutation usersConfigGetNotificationByEmail($isAllowed: Boolean) {
    usersConfigGetNotificationByEmail(isAllowed: $isAllowed) {
      _id
    }
  }
`;

const notificationsSaveConfig = `
  mutation notificationsSaveConfig(
    $notifType: String!
    $isAllowed: Boolean
  ) {
    notificationsSaveConfig(
      notifType: $notifType
      isAllowed: $isAllowed
    ) {
      _id
    }
  }
`;

export default {
  usersChangePassword,
  notificationsSaveConfig,
  usersConfigGetNotificationByEmail
};
