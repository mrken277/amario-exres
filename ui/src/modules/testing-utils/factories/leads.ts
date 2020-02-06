import * as Factory from 'factory.ts';
import { Counts, ICallout, ILeadData, ILeadIntegration, IntegrationsCount } from 'modules/leads/types';
import { conditionsRuleFactory } from './common';
import { formFactory } from './forms';
import { messengerDataFactory } from './messengerdata';
import { brandFactory } from './settings/brands';
import { channelFactory } from './settings/channel';
import { uiOptionsFactory } from './settings/integration';
import { tagFactory } from './tags';
import { userFactory } from './user';

export const countFactory = Factory.Sync.makeFactory<Counts>({
  type: 3
});

export const integrationsCountFactory = Factory.Sync.makeFactory<IntegrationsCount>({
  total: 3,
  byTag: countFactory.build({ type: 3 }),
  byChannel: countFactory.build({ type: 3 }),
  byBrand: countFactory.build({ type: 3 }),
  byKind: countFactory.build({ type: 3 }),
});

export const calloutFactory = Factory.Sync.makeFactory<ICallout>({
  title: 'string',
  body: 'string',
  buttonText: 'string',
  featuredImage: 'string',
  skip: false
});

export const leadDataFactory = Factory.Sync.makeFactory<ILeadData>({
  loadType: 'string',
  successAction: 'string',
  fromEmail: 'string',
  userEmailTitle: 'string',
  userEmailContent: 'string',
  adminEmails: ['string'],
  adminEmailTitle: 'string',
  adminEmailContent: 'string',
  thankContent: 'string',
  redirectUrl: 'string',
  themeColor: 'string',
  callout: calloutFactory.build({ title: 'string' }),
  rules: [
    conditionsRuleFactory.build(),
    conditionsRuleFactory.build({ _id: '1' })
  ],
  createdUserId: 'string',
  createdUser: userFactory.build({ _id: '3' }),
  createdDate: new Date(),
  viewCount: 55,
  contactsGathered: 23,
  tagIds: ['tagd'],
  getTags: [
    tagFactory.build(),
    tagFactory.build({ _id: '23' })
  ],
  form: formFactory.build({ _id: '3' })
});

export const leadIntegrationFactory = Factory.Sync.makeFactory<ILeadIntegration>({
  tags: [tagFactory.build(), tagFactory.build({ _id: '25' })],
  createdUser: userFactory.build({ _id: '3' }),
  // extends IIntegration
  _id: '3',
  kind: 'messenger',
  name: 'name',
  brandId: '1',
  code: '45',
  formId: '4',
  languageCode: '2',
  createUrl: '2',
  createModal: '2',
  messengerData: messengerDataFactory.build({ isOnline: true }),
  form: formFactory.build({ _id: '3' }),
  uiOptions: uiOptionsFactory.build({
    color: '#fcfcfc',
    wallpaper: 'string',
    logo: '/erxes',
    logoPreviewUrl: '/erxes'
  }),
  leadData: leadDataFactory.build({}),
  brand: brandFactory.build({ _id: '3' }),
  channels: [channelFactory.build(), channelFactory.build({ _id: '25' })],
  isActive: true
});