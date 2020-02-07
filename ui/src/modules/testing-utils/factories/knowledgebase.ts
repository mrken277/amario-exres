import * as Factory from 'factory.ts';
import { IArticle, ICategory, ITopic } from 'modules/knowledgeBase/types';
import { brandFactory } from './settings/brands';
import { userFactory } from './user';

export const articleFactory = Factory.Sync.makeFactory<IArticle>({
  _id: '1',
  title: 'title',
  summary: 'sum',
  content: 'content',
  status: 'stts',
  reactionChoices: [''],
  reactionCounts: {},
  createdBy: 'user',
  createdUser: userFactory.build(),
  createdDate: new Date,
  modifiedBy: 'admin',
  modifiedDate: new Date,
});

export const categoryFactory = Factory.Sync.makeFactory<ICategory>({
  _id: '1',
  title: 'title',
  description: 'desc',
  articles: [articleFactory.build()],
  icon: 'icon-smile',
  createdBy: 'user',
  createdDate: new Date,
  modifiedBy: 'me',
  modifiedDate: new Date,
  firstTopic: {} as ITopic
});

export const topicFactory = Factory.Sync.makeFactory<ITopic>({
  _id: '1',
  title: 'title',
  description: 'desc',
  categories: [categoryFactory.build()],
  brand: brandFactory.build(),
  color: '#fff',
  backgroundImage: '/image',
  languageCode: 'mn',
  createdBy: 'user',
  createdDate: new Date(),
  modifiedBy: 'author',
  modifiedDate: new Date()
});