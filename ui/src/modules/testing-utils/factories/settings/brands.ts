import * as Factory from 'factory.ts';
import { IBrand } from 'modules/settings/brands/types';

export const brandFactory = Factory.Sync.makeFactory<IBrand>({
  _id: 'string',
  code: 'string',
  name: 'string',
  createdAt: 'string',
  description: 'string',
  emailConfig: { type: 'string', template: 'string' }
});
