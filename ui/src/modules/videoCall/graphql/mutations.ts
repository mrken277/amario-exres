const createVideoChatRoom = `
  mutation conversationCreateVideoChatRoom($conversationId: String) {
    conversationCreateVideoChatRoom(conversationId: $conversationId) {
      name
    }
  }
`;

const deleteVideoChatRoom = `
  mutation conversationDeleteVideoChatRoom($name: String!) {
    conversationDeleteVideoChatRoom(name: $name) {
      deleted
    }
  }
`;

export default {
  createVideoChatRoom,
  deleteVideoChatRoom
};
