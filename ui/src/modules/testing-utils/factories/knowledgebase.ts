import * as Factory from 'factory.ts';
import { IArticle, ICategory, ITopic } from 'modules/knowledgeBase/types';
import { brandFactory } from './settings/brands';
import { userFactory } from './user';

export const articleFactory = Factory.Sync.makeFactory<IArticle>({
  _id: 'string',
  title: 'string',
  summary: 'string',
  content: 'string',
  status: 'string',
  reactionChoices: ['string'],
  reactionCounts: 'any',
  createdBy: 'string',
  createdUser: userFactory.build({ _id: '' }),
  createdDate: new Date(),
  modifiedBy: 'string',
  modifiedDate: new Date()
});

export const topicFactoryL = Factory.Sync.makeFactory<ITopic>({
  _id: '1',
  title: 'title',
  description: 'desc',
  categories: [],
  brand: brandFactory.build(),
  color: '#fff',
  backgroundImage: '/image',
  languageCode: 'mn',
  createdBy: 'user',
  createdDate: new Date(),
  modifiedBy: 'author',
  modifiedDate: new Date()
});

export const categoryFactory = Factory.Sync.makeFactory<ICategory>({
  _id: 'string',
  title: 'string',
  description: 'string',
  articles: [articleFactory.build(), articleFactory.build({ _id: '3' })],
  icon: 'string',
  createdBy: 'string',
  createdDate: new Date(),
  modifiedBy: 'string',
  modifiedDate: new Date(),
  firstTopic: topicFactoryL.build({ _id: '' })
});

export const topicFactory = Factory.Sync.makeFactory<ITopic>({
  _id: '1',
  title: 'title',
  description: 'desc',
  categories: [categoryFactory.build(), categoryFactory.build({ _id: '3' })],
  brand: brandFactory.build(),
  color: '#fff',
  backgroundImage: '/image',
  languageCode: 'mn',
  createdBy: 'user',
  createdDate: new Date(),
  modifiedBy: 'author',
  modifiedDate: new Date()
});
