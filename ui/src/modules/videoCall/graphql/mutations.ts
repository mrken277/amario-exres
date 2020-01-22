const deleteVideoChatRoom = `
  mutation conversationDeleteVideoChatRoom($name: String!) {
    conversationDeleteVideoChatRoom(name: $name) {
      deleted
    }
  }
`;

export default {
  deleteVideoChatRoom
};
