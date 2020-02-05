import * as Factory from 'factory.ts';
import { IInternalNote } from 'modules/internalNotes/types';
import { userFactory } from './user';

export const internalNoteFactory = Factory.Sync.makeFactory<IInternalNote>({
  _id: 'string',
  content: 'string',
  createdUser: userFactory.build({ _id: '3' }),
  createdAt: new Date

});