import * as Factory from 'factory.ts';
import { ITag } from 'modules/tags/types';

export const tagFactory = Factory.Sync.makeFactory<ITag>({
  _id: '23',
  type: 'tag',
  name: 'testtag',
  colorCode: '#ccc',
  objectCount: 45
});