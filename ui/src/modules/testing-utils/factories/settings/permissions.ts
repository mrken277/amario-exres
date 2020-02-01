import * as Factory from 'factory.ts';
import { IUserGroup } from 'modules/settings/permissions/types';
import { userFactory } from '../auth';

export const userGroupFactory = Factory.Sync.makeFactory<IUserGroup>({
  _id: '1',
  name: 'nmma',
  description: 'company',
  memberIds: ['1'],
  members: [
    userFactory.build(),
    userFactory.build({ _id: '3' }),
  ]
});
