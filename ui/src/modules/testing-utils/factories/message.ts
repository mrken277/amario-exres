import * as Factory from 'factory.ts';
import { IMessage } from 'modules/inbox/types';
import { userFactory } from './auth';
import { customerFactory } from './customer/customer';
import { mailFactory } from './email';
import { engageDataFactory } from './engage';

export const messageFactory = Factory.Sync.makeFactory<IMessage>({
  content: 'string',
  attachments: 'any',
  mentionedUserIds: ['string'],
  conversationId: 'string',
  internal: true,
  fromBot: false,
  customerId: 'string',
  userId: 'string',
  isCustomerRead: false,
  formWidgetData: 'any',
  messengerAppData: 'any',
  engageData: engageDataFactory.build({ messageId: '21' }),
  mailData: mailFactory.build({
    integrationEmail: 'integration@nmma.co',
    messageId: '11',
    headerId: '9',
    accountId: '8',
    replyToMessageId: '8'
  }
  ),
  _id: 'string',
  user: userFactory.build({ _id: '5' }),
  customer: customerFactory.build({ _id: '1' }),
  createdAt: new Date(),
  updatedAt: new Date()
});