import * as Factory from 'factory.ts';
import { ICallout, ILeadData } from 'modules/leads/types';
import { conditionsRuleFactory } from './common';
import { formFactory } from './forms';
import { tagFactory } from './tags';
import { userFactory } from './user';

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