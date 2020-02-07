import dayjs from 'dayjs';
import * as Factory from 'factory.ts';
import { IBrand } from 'modules/settings/brands/types';

export const brandFactory = Factory.Sync.makeFactory<IBrand>({
  _id: '1',
  code: 'nmma',
  name: 'Erxes',
  createdAt: dayjs().format('YYYY-MM-DD'),
  description: 'special brand',
  emailConfig: { type: 'string', template: 'string' }
});


