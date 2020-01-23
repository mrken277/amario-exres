import * as Factory from 'factory.ts';
import { IAttachment } from 'modules/common/types';
import { IEmailDelivery, IEngageEmail, IEngageMessage, IEngageMessenger, IEngageScheduleDate, IEngageStats } from 'modules/engage/types';
import { ISegment, ISegmentCondition } from 'modules/segments/types';
import { IEmailSignature } from 'modules/settings/email/types';
import { brandFactory } from './brands';
import { conditionsRuleFactory } from './common';
import { tagFactory } from './tags';
import { userFactory } from './user';

export const engageMessengerFactory = Factory.Sync.makeFactory<IEngageMessenger>({
  brandId: '22',
  kind: 'auto',
  sentAs: 'Dorj',
  content: 'Hello',
  rules: [
    conditionsRuleFactory.build(),
    conditionsRuleFactory.build({ _id: '21' })
  ]
});

export const attachmentFactory = Factory.Sync.makeFactory<IAttachment>({
  name: 'Images1',
  type: 'img',
  url: '/images/logo',
  size: 12
});

export const engageEmailFactory = Factory.Sync.makeFactory<IEngageEmail>({
  templateId: '3',
  subject: 'Subject',
  content: 'content',
  attachments: [
    attachmentFactory.build(),
    attachmentFactory.build({ name: 'Images1' })
  ],
});

export const segmentConditionFactory = Factory.Sync.makeFactory<ISegmentCondition>({
  _id: '15',
  field: 'auto',
  value: 'string',
  operator: 'string',
  dateUnit: 'string',
  type: 'string',
  brandId: 'string',
});

export const segmentFactory = Factory.Sync.makeFactory<ISegment>({
  _id: '5',
  contentType: 'type',
  getSubSegments: [],
  getParentSegment: {} as ISegment,
  // ISegmentDocs
  name: 'segment',
  description: 'desc',
  color: '#fff',
  connector: 'connect',
  conditions: [
    segmentConditionFactory.build(),
    segmentConditionFactory.build({ _id: '15' })
  ],
  subOf: 'sub'
});

export const emailSignatureFactory = Factory.Sync.makeFactory<IEmailSignature>({
  brandId: '22',
  signature: 'erxes'
});

export const engageStatsFactory = Factory.Sync.makeFactory<IEngageStats>({
  send: 3,
  delivery: 4,
  open: 5,
  click: 11,
  complaint: 1,
  bounce: 6,
  renderingfailure: 7,
  reject: 9,
  total: 25,
});

export const engageScheduleDateFactory = Factory.Sync.makeFactory<IEngageScheduleDate>({
  type: 'everyday',
  month: 'July',
  day: '23',
  time: new Date()
});

export const engageMessageFactory = Factory.Sync.makeFactory<IEngageMessage>({
  _id: '4',
  stopDate: new Date(),
  createdDate: new Date(),
  messengerReceivedCustomerIds: ['test', '4'],
  brand: brandFactory.build({ _id: '3', name: 'Erxes' }),
  segment: segmentFactory.build({ _id: '5' }),
  fromUser: userFactory.build({ _id: '12', email: 'erxes@nmma.co' }),
  tagIds: ['12', '13'],
  getTags: [
    tagFactory.build(),
    tagFactory.build({ _id: '23' })
  ],
  stats: engageStatsFactory.build({}),
  logs: [{ message: 'string' }],
  // IEngageMessageDocs
  kind: 'auto',
  type: 'email',
  segmentIds: ['1,2'],
  brandIds: ['3,4'],
  customerIds: ['3,4'],
  title: 'test',
  fromUserId: '22',
  method: '22',
  isDraft: true,
  isLive: false,
  email: engageEmailFactory.build({ templateId: '3' }),
  messenger: engageMessengerFactory.build({ brandId: '22' }),
  scheduleDate: engageScheduleDateFactory.build({ type: 'everyday', month: 'July', day: '12', time: '2' })
});

export const emailDeliveryFactory = Factory.Sync.makeFactory<IEmailDelivery>({
  _id: '33',
  subject: 'subject',
  body: 'Body',
  to: 'Dulam@yahoo.com',
  cc: 'erxes@gmail.com',
  bcc: 'erxes@nmma.co',
  attachments: [JSON],
  from: 'erxes',
  kind: 'auto',
  userId: '12',
  customerId: '22',

  fromUser: userFactory.build({ _id: '12' }),
  fromEmail: 'erxes@nmma.co'
});