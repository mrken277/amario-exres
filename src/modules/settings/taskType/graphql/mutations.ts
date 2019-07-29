const commonParamsDef = `
  $name: String!,
  $icon: String!
`;

const commonParams = `
  name: $name,
  icon: $icon
`;

const taskTypesAdd = `
  mutation taskTypesAdd(${commonParamsDef}) {
    taskTypesAdd(${commonParams}) {
      _id
    }
  }
`;

const taskTypesEdit = `
  mutation taskTypesEdit($_id: String!, ${commonParamsDef}) {
    taskTypesEdit(_id: $_id, ${commonParams}) {
      _id
    }
  }
`;

const taskTypesRemove = `
  mutation taskTypesRemove($_id: String!) {
    taskTypesRemove(_id: $_id) {
      _id
    }
  }
`;

export default {
  taskTypesAdd,
  taskTypesEdit,
  taskTypesRemove
};
