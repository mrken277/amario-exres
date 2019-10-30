const activityLogs = `
  query activityLogs($contentType: String!, $contentId: String!, $activityType: String, $limit: Int ) {
    activityLogs(contentType: $contentType, contentId: $contentId, activityType: $activityType, limit: $limit) {
      _id
      action
      id
      createdAt
      content
      by {
        _id
        type
        details {
          avatar
          fullName
          position
        }
      }
    }
  }
`;

const conformitiesForActivity = `
  query conformitiesForActivity($contentType: String!, $contentId: String!, $activityType: String, $limit: Int) {
    conformitiesForActivity(contentType: $contentType, contentId: $contentId, activityType: $activityType, limit: $limit) {
      mainType
      mainTypeId
      relType
      relTypeId
      content
      editAble
      createdUser
    }
  }
`;

export default {
  conformitiesForActivity,
  activityLogs
};
