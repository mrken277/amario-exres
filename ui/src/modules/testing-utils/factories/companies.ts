import * as Factory from 'factory.ts';
import { ICompany, ICompanyLinks } from 'modules/companies/types';
import { userFactory } from './auth';
import { customerFactory } from './customer';

export const companyLinksFactory = Factory.Sync.makeFactory<ICompanyLinks>({
  linkedIn: 'linkedIn',
  twitter: 'twitter',
  facebook: 'facebook',
  github: 'github',
  youtube: 'youtube',
  website: 'website'
});

export const companyFactory = Factory.Sync.makeFactory<ICompany>({
  _id: 'string',
  owner: userFactory.build({ _id: '12' }),
  getTags: [],
  customers: [customerFactory.build(), customerFactory.build({ _id: '22' })],

  // ICompanyDoc
  createdAt: new Date(),
  modifiedAt: new Date(),
  avatar: 'string',

  primaryName: 'string',
  names: [],
  size: 15,
  industry: 'string',
  website: 'string',
  plan: 'string',
  parentCompanyId: 'string',

  ownerId: 'string',

  emails: ['string'],
  primaryEmail: 'string',

  primaryPhone: 'string',
  phones: ['string'],

  leadStatus: 'string',
  lifecycleState: 'string',
  businessType: 'string',
  description: 'string',
  employees: 56,
  doNotDisturb: 'string',
  links: companyLinksFactory.build({
    linkedIn: 'linkedIn',
    twitter: 'twitter'
  }),
  tagIds: ['string'],
  customFieldsData: 'any'
});
