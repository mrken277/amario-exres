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

const internalNoteDetail = `
  query internalNoteDetail($_id: String!) {
    internalNoteDetail(_id: $_id) {
      _id
      content
    }
  }
`;

export default {
  conformitiesForActivity,
  internalNoteDetail,
  activityLogs
};
