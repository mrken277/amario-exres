import * as Factory from 'factory.ts';
import { IConversation, IFacebookPost } from 'modules/inbox/types';
import { customerFactory } from './customer/customer';
import { integrationFacroty } from './integration';
import { tagFactory } from './tags';
import { userFactory } from './user';

export const facebookPostFactory = Factory.Sync.makeFactory<IFacebookPost>({
  postId: '66',
  recipientId: '22',
  senderId: 'erxet',
  content: 'sainuu',
  erxesApiId: '11',
  attachments: ['img1', 'img2'],
  timestamp: new Date(),
  commentCount: 23
});

export const conversationFactory = Factory.Sync.makeFactory<IConversation>({
  _id: '1',
  content: 'content',
  integrationId: '3',
  customerId: '3',
  userId: '11',
  assignedUserId: '11',
  participatedUserIds: ['1', '2'],
  readUserIds: ['1', '2'],
  createdAt: new Date(),

  closedAt: new Date(),
  closedUserId: '3',

  status: 'ok',
  messageCount: 5,
  tagIds: ['3', '13'],

  // number of total conversations
  number: 33,

  integration: integrationFacroty.build({ _id: '3' }),
  customer: customerFactory.build({ _id: '2' }),
  assignedUser: userFactory.build({ _id: '5' }),
  participatedUsers: [
    userFactory.build(),
    userFactory.build({ _id: '5' })
  ],
  tags: [
    tagFactory.build(),
    tagFactory.build({ _id: '6' })
  ],
  updatedAt: new Date(),
  idleTime: 56,
  facebookPost: facebookPostFactory.build({ postId: '66' }),
  callProAudio: 'string'
});
