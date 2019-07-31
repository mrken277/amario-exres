const commonParams = `
  $contentType: String
  $contentId: String
  $assignedUserIds: [String],
  $nextDay: String,
  $nextWeek: String,
  $nextMonth: String,
  $noCloseDate: String,
  $overdue: String,
  $priority: [String],
`;

const commonParamDefs = `
  contentType: $contentType,
  contentId: $contentId,
  assignedUserIds: $assignedUserIds,
  nextDay: $nextDay,
  nextWeek: $nextWeek,
  nextMonth: $nextMonth,
  noCloseDate: $noCloseDate,
  overdue: $overdue,
  priority: $priority
`;

const taskFields = `
  _id
  name
  stageId
  pipeline {
    _id
    name
  }
  boardId
  typeId
  contentType
  contentId
  content
  closeDate
  description
  priority
  assignedUsers {
    _id
    email
    details {
      fullName
      avatar
    }
  }
  stage {
    probability
  }
  type {
    _id
    name
    icon
  }
  isDone
  isWatched
  attachments {
    name
    url
    type
    size
  }
  modifiedAt
  modifiedBy
`;

const tasks = `
  query tasks(
    $pipelineId: String,
    $stageId: String,
    $date: ItemDate,
    $skip: Int,
    $search: String,
    ${commonParams}
  ) {
    tasks(
      pipelineId: $pipelineId,
      stageId: $stageId,
      date: $date,
      skip: $skip,
      search: $search,
      ${commonParamDefs}
    ) {
      ${taskFields}
    }
  }
`;

const taskDetail = `
  query taskDetail($_id: String!) {
    taskDetail(_id: $_id) {
      ${taskFields}
    }
  }
`;

const taskTypes = `
  query taskTypes {
    taskTypes {
      _id
      name
      icon
    }
  }
`;

export default {
  tasks,
  taskDetail,
  taskTypes
};
