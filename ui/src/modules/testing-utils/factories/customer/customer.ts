import * as Factory from 'factory.ts';
import { ICustomer, ICustomerLinks, IVisitorContact } from 'modules/customers/types';
import { companyFactory } from '../companies';
import { integrationFacroty } from '../settings/integration';
import { tagFactory } from '../tags';
import { userFactory } from '../user';
import { messengerDataFactory } from './messengerdata';

export const customerLinksFactory = Factory.Sync.makeFactory<ICustomerLinks>({
  website: 'website',
  facebook: 'facebook',
  twitter: 'twitter',
  linkedIn: 'linkedIn',
  youtube: 'youtube',
  github: 'github',
});

export const visitorContactFactory = Factory.Sync.makeFactory<IVisitorContact>({
  email: 'dulamaa@yahoo.com',
  phone: '99889988'
});

export interface IMessengerData {
  lastSeenAt?: number;
  sessionCount?: number;
  isActive?: boolean;
  customData?: any;
}

export const customerFactory = Factory.Sync.makeFactory<ICustomer>({
  _id: '1',
  owner: userFactory.build({ _id: '12' }),
  integration: integrationFacroty.build({ _id: '21' }),
  getMessengerCustomData: 'any',
  getTags: [tagFactory.build(), tagFactory.build({ _id: '6' })],
  companies: [companyFactory.build(), companyFactory.build({ _id: '22' })],

  // ICustomerDocs
  firstName: 'string',
  lastName: 'string',
  phones: ['88888888'],
  primaryPhone: 'string',
  primaryEmail: 'string',
  emails: ['erxes@gmail.com'],
  avatar: 'string',
  isUser: true,
  ownerId: 'string',
  position: 'string',
  location: {
    userAgent: 'string',
    country: 'string',
    countryCode: 'string',
    remoteAddress: 'string',
    hostname: 'string',
    language: 'string',
  },
  department: 'string',
  leadStatus: 'string',
  lifecycleState: 'string',
  hasAuthority: 'string',
  description: 'string',
  doNotDisturb: 'string',
  links: customerLinksFactory.build({ facebook: 'facebook' }),
  messengerData: messengerDataFactory.build({ isActive: true }),
  customFieldsData: { customFieldIds: 'any' },
  visitorContactInfo: visitorContactFactory.build({
    email: 'dulamaa@yahoo.com',
    phone: '99889988'
  }),
  code: 'string',
});
