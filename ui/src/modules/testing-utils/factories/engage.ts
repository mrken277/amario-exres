import * as Factory from 'factory.ts';
import { IEngageConfig, IEngageEmail, IEngageMessage, IEngageMessenger, IEngageScheduleDate, IEngageStats } from 'modules/engage/types';
import { IEngageData, IEngageDataRules } from 'modules/inbox/types';
import { attachmentFactory } from './attachment';
import { conditionsRuleFactory } from './common';
import { segmentFactory } from './segments';
import { brandFactory } from './settings/brands';
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

export const engageDataRulesFactory = Factory.Sync.makeFactory<IEngageDataRules>({
  kind: 'manual',
  text: 'test11',
  condition: 'content',
  value: 'engagedata',
});

export const engageConfigFactory = Factory.Sync.makeFactory<IEngageConfig>({
  accessKeyId: '1',
  secretAccessKey: '2',
  region: 'mn'
});

export const engageDataFactory = Factory.Sync.makeFactory<IEngageData>({
  messageId: '21',
  brandId: '3',
  content: 'content',
  fromUserId: '11',
  kind: 'manual',
  sentAs: 'me',
  rules: [
    engageDataRulesFactory.build(),
    engageDataRulesFactory.build({ kind: 'manual', text: 'test11' })
  ]
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