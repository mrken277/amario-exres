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
  query conformitiesForActivity($conformityTypes: [String], $contentId: String!, $conformityType: String, $limit: Int) {
    conformitiesForActivity(conformityTypes: $conformityTypes, contentId: $contentId, conformityType: $conformityType, limit: $limit) {
      mainType
      mainTypeId
      relType
      relTypeId
      content
      editAble
      createdAt
      createdUser {
        details {
          avatar
          fullName
          position
        }
      }
    }
  }
`;

export default {
  conformitiesForActivity,
  activityLogs
};
