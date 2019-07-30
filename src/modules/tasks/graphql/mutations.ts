const commonVariables = `
  $name: String!,
  $isDone: Boolean
  $stageId: String,
  $dealId: String,
  $ticketId: String,
  $typeId: String,
  $assignedUserIds: [String],
  $companyIds: [String],
  $attachments: [AttachmentInput]
  $customerIds: [String],
  $closeDate: Date,
  $description: String,
  $order: Int,
  $priority: String,
`;

const commonParams = `
  name: $name,
  isDone: $isDone,
  stageId: $stageId,
  dealId: $dealId,
  ticketId: $ticketId,
  typeId: $typeId,
  assignedUserIds: $assignedUserIds,
  companyIds: $companyIds,
  attachments: $attachments,
  customerIds: $customerIds,
  closeDate: $closeDate,
  description: $description,
  order: $order,
  priority: $priority
`;

const commonReturn = `
  _id
  name
  stageId
  boardId
  dealId
  ticketId
  typeId
  companyIds
  customerIds
  assignedUserIds
  deal {
    _id
    name
  }
  ticket {
    _id
    name
  }
  type {
    _id
    name
    icon
  }
  companies {
    _id
    primaryName
  }
  customers {
    _id
    firstName
    primaryEmail
  }
  closeDate
  description
  assignedUsers {
    _id
    email
    details {
      fullName
      avatar
    }
  }
  isWatched
  isDone
  priority
  modifiedAt
  modifiedBy
  createdAt
`;

const tasksAdd = `
  mutation tasksAdd(${commonVariables}) {
    tasksAdd(${commonParams}) {
      ${commonReturn}
    }
  }
`;

const tasksEdit = `
  mutation tasksEdit($_id: String!, ${commonVariables}) {
    tasksEdit(_id: $_id, ${commonParams}) {
      ${commonReturn}
    }
  }
`;

const tasksRemove = `
  mutation tasksRemove($_id: String!) {
    tasksRemove(_id: $_id) {
      _id
    }
  }
`;

const tasksChange = `
  mutation tasksChange($_id: String!, $destinationStageId: String!) {
    tasksChange(_id: $_id, destinationStageId: $destinationStageId) {
      _id
    }
  }
`;

const tasksUpdateOrder = `
  mutation tasksUpdateOrder($stageId: String!, $orders: [OrderItem]) {
    tasksUpdateOrder(stageId: $stageId, orders: $orders) {
      _id
    }
  }
`;

const tasksWatch = `
  mutation tasksWatch($_id: String!, $isAdd: Boolean!) {
    tasksWatch(_id: $_id, isAdd: $isAdd) {
      _id
      isWatched
    }
  }
`;

export default {
  tasksAdd,
  tasksEdit,
  tasksRemove,
  tasksChange,
  tasksUpdateOrder,
  tasksWatch
};
