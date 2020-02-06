import * as Factory from 'factory.ts';
import { IMessengerData } from 'modules/customers/types';

export const messengerDataFactory = Factory.Sync.makeFactory<IMessengerData>({
  lastSeenAt: 9,
  sessionCount: 9,
  isActive: true,
  customData: 'data'
});