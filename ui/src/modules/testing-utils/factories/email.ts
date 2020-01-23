import * as Factory from 'factory.ts';
import { IEmail, IMail, IMailAttachment } from 'modules/inbox/types';

export const emailFactory = Factory.Sync.makeFactory<IEmail>({
  name: 'test',
  email: 'test@nmma.co',
});

export const mailAttachmentFactory = Factory.Sync.makeFactory<IMailAttachment>({
  id: '8',
  filename: 'file',
  content_type: 'file',
  mimeType: 'file',
  size: 23,
  attachmentId: 'file',
  data: 'file',
});

export const mailFactory = Factory.Sync.makeFactory<IMail>({
  integrationEmail: 'integration@nmma.co',
  messageId: '11',
  headerId: '9',
  accountId: '8',
  replyToMessageId: '8',
  from: [
    emailFactory.build(),
    emailFactory.build({ name: 'test', email: 'test@nmma.co' })
  ],
  to: [
    emailFactory.build(),
    emailFactory.build({ name: 'test', email: 'test@nmma.co' })
  ],
  cc: [
    emailFactory.build(),
    emailFactory.build({ name: 'test', email: 'test@nmma.co' })
  ],
  bcc: [
    emailFactory.build(),
    emailFactory.build({ name: 'test', email: 'test@nmma.co' })],
  reply: 'string',
  references: 'string',
  threadId: 'string',
  subject: 'string',
  body: 'string',
  attachments: [
    mailAttachmentFactory.build(),
    mailAttachmentFactory.build({ id: '8' })
  ]
});