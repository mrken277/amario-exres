const dealsChanged = `
  subscription dealsChanged($_id: String!) {
    dealsChanged(_id: $_id) {
      _id
    }
  }
`;

const dealsMoved = `
  subscription dealsMoved {
    dealsMoved
  }
`;

export default {
  dealsChanged,
  dealsMoved
};
