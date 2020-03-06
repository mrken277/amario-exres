const tasksChanged = `
  subscription tasksChanged($_id: String!) {
    tasksChanged(_id: $_id) {
      _id
    }
  }
`;

const tasksMoved = `
  subscription tasksMoved {
    tasksMoved
  }
`;

export default {
  tasksChanged,
  tasksMoved
};
