const createVideoChatRoom = `
  mutation conversationCreateVideoChatRoom($conversationId: String) {
    conversationCreateVideoChatRoom(conversationId: $conversationId) {
      name
    }
  }
`;

export default {
  createVideoChatRoom
};
