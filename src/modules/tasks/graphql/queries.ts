const commonParams = `
  $dealId: String
  $ticketId: String
  $customerIds: [String],
  $companyIds: [String],
  $assignedUserIds: [String],
  $nextDay: String,
  $nextWeek: String,
  $nextMonth: String,
  $noCloseDate: String,
  $overdue: String,
  $priority: [String],
`;

const commonParamDefs = `
  dealId: $dealId,
  ticketId: $ticketId,
  customerIds: $customerIds,
  companyIds: $companyIds,
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
  dealId
  ticketId
  typeId
  companies {
    _id
    primaryName
    website
  }
  customers {
    _id
    firstName
    primaryEmail
    primaryPhone
  }
  deal {
    _id
    name
    stageId
    boardId
  }
  ticket {
    _id
    name
    stageId
    boardId
  }
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
