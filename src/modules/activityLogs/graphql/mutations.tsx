const internalNotesEdit = `
  mutation internalNotesEdit($_id: String!, $content: String) {
    internalNotesEdit(_id: $_id, content: $content) {
        _id
        content
      }
  }
`;

const internalNotesRemove = `
  mutation internalNotesRemove($_id: String!) {
    internalNotesRemove(_id: $_id) {
      _id
    }
  }
`;

export default {
  internalNotesEdit,
  internalNotesRemove
};
