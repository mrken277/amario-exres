import * as Factory from 'factory.ts';
import { IImportHistory, IImportHistoryItem } from 'modules/settings/importHistory/types';
import { userFactory } from '../user';

export const importHistoryFactory = Factory.Sync.makeFactory<IImportHistory>({
  _id: '1',
  success: '1',
  failed: '1',
  total: '1',
  contentType: 'type',
  date: new Date(),
  user: userFactory.build(),
  status: 'on',
  percentage: 0,
  errorMsgs: ['']
});

export const importHistoryItemFactory = Factory.Sync.makeFactory<IImportHistoryItem>({
  list: [importHistoryFactory.build()],
  count: 0
});
