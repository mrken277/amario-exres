import * as Factory from 'factory.ts';
import { INotification, NotificationConfig, NotificationModule, NotificationModuleType } from 'modules/notifications/types';
import { userFactory } from './auth';

export const notificationConfigFactory = Factory.Sync.makeFactory<NotificationConfig>({
  _id: '1',
  user: 'usr',
  notifType: '0',
  isAllowed: false
});

export const notificationModuleTypeFactory = Factory.Sync.makeFactory<NotificationModuleType>({
  name: 'erxes',
  text: 'txt'
});

export const notificationModuleFactory = Factory.Sync.makeFactory<NotificationModule>({
  name: 'nmma',
  description: 'desc',
  types: [notificationModuleTypeFactory.build()]
});

export const notificationFactory = Factory.Sync.makeFactory<INotification>({
  _id: '3',
  notifType: 'conversationAddMessage',
  title: 'You have a new message.',
  link: '/inbox?_id=2MPEvPzNfAuFnhDnD',
  content: '<p>soju gee shileer n borluuldiimu esvel 50ml eer bas borluuldiimu</p>',
  action: 'add',
  createdUser: userFactory.build({ _id: '12' }),
  receiver: 'd8qFxhABR2fRXcc5d',
  date: new Date(),
  isRead: false,
});