import * as Factory from 'factory.ts';
import { IAttachment } from 'modules/common/types';

export const attachmentFactory = Factory.Sync.makeFactory<IAttachment>({
  name: 'Images1',
  type: 'img',
  url: '/images/logo',
  size: 12
});