import * as Factory from 'factory.ts';
import { ILog } from 'modules/settings/logs/types';

export const logFactory = Factory.Sync.makeFactory<ILog>({
  _id: '1',
  createdAt: new Date(),
  createdBy: 'user',
  type: 'type',
  action: '',
  oldData: '',
  newData: '',
  objectId: '',
  unicode: '',
  description: 'desc',
  extraDesc: '',
  addedData: '',
  changedData: '',
  unchangedData: '',
  removedData: '',
});


