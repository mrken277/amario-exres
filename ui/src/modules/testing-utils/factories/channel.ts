import * as Factory from 'factory.ts';
import { IChannel } from 'modules/settings/channels/types';
import { userFactory } from './user'

export const channelFactory = Factory.Sync.makeFactory<IChannel>({
  _id: '25',
  name: 'channel',
  description: 'desc',
  integrationIds: ['11', '12'],
  memberIds: ['11', '12'],
  members: [
    userFactory.build(),
    userFactory.build({ _id: '3' }),
  ]
});