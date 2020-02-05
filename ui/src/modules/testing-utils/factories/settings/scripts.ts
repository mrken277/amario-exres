import * as Factory from 'factory.ts';
import { IScript } from 'modules/settings/scripts/types';
import { integrationFactory } from './integration';

export const scriptFactory = Factory.Sync.makeFactory<IScript>({
  _id: '1',
  name: 'string',
  messengerId: '',
  leadIds: [''],
  leads: [integrationFactory.build()],
  kbTopicId: ''
});
