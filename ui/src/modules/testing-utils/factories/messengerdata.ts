import * as Factory from 'factory.ts';
import { ILink, IMessages, IMessagesItem, IMessengerData, IOnlineHour } from 'modules/settings/integrations/types';

export const messagesItemFactory = Factory.Sync.makeFactory<IMessagesItem>({
  greetings: { title: 'Erxes', message: 'message' },
  away: 'away',
  thank: 'think',
  welcome: 'welcome'
});

export const messagesFactory = Factory.Sync.makeFactory<IMessages>({
  supporterIds: messagesItemFactory.build({ greetings: { title: 'Erxes', message: 'message' }, away: 'away' })
});

export const onlineHourFactory = Factory.Sync.makeFactory<IOnlineHour>({
  _id: '1',
  day: '11',
  from: 'from',
  to: 'to'
});

export const linkFactory = Factory.Sync.makeFactory<ILink>({
  twitter: 'twitter',
  facebook: 'facebook',
  youtube: 'youtube'
});

export const messengerDataFactory = Factory.Sync.makeFactory<IMessengerData>({
  messages: messagesFactory.build({ supporterIds: ({ greetings: { title: 'Erxes', message: 'message' }, away: 'away' }) }),
  notifyCustomer: false,
  supporterIds: ['string'],
  availabilityMethod: 'string',
  isOnline: true,
  timezone: 'string',
  requireAuth: true,
  showChat: true,
  showLauncher: true,
  forceLogoutWhenResolve: true,
  onlineHours: [
    onlineHourFactory.build(),
    onlineHourFactory.build({ _id: '1' })
  ],
  links: linkFactory.build({ twitter: 'twitter', facebook: 'facebook' })
});