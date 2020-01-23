import * as Factory from 'factory.ts';
import { ITag } from 'modules/tags/types';

export const tagsFactory = Factory.Sync.makeFactory<ITag>({
    _id: '1',
    type: 'tagType',
    name: 'erxes',
    colorCode: '#fff',
    objectCount: 0
});