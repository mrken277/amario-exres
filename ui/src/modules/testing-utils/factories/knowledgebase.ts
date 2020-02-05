import * as Factory from 'factory.ts';
import { ITopic } from 'modules/knowledgeBase/types';
import { brandFactory } from './settings/brands';

export const topicFactory = Factory.Sync.makeFactory<ITopic>({
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