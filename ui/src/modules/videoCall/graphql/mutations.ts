const createDailyVideoCall = `
  mutation conversationCreateDailyVideoCall($conversationId: String) {
    conversationCreateDailyVideoCall(conversationId: $conversationId) {
      roomName
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
  createDailyVideoCall,
  deleteVideoChatRoom
};
