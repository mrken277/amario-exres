import * as Factory from 'factory.ts';
import { IField, IFieldGroup } from 'modules/settings/properties/types';
import { userFactory } from '../auth';

const fieldFactory = Factory.Sync.makeFactory<IField>({
  _id: 'string',
  key: 'string',
  contentType: 'string',
  contentTypeId: 'string',
  type: 'string',
  validation: 'string',
  text: 'string',
  description: 'string',
  options: [''],
  isRequired: false,
  order: {},
  isVisible: false,
  isDefinedByErxes: false,
  groupId: 'string',
  lastUpdatedUser: (
    userFactory.build(),
    userFactory.build({ _id: '2' })
  ),
  lastUpdatedUserId: 'string',
});

export const propertiesFactory = Factory.Sync.makeFactory<IFieldGroup>({
  _id: '1',
  name: 'name',
  contentType: 'string',
  order: {},
  description: 'string',
  isVisible: false,
  isDefinedByErxes: false,
  fields: [
    fieldFactory.build(),
    fieldFactory.build({ _id: '2' })
  ],
  lastUpdatedUserId: 'string',
  lastUpdatedUser: (
    userFactory.build(),
    userFactory.build({ _id: '2' })
  )
});
