import * as Factory from 'factory.ts';
import { IProduct, IProductCategory, IProductCategoryDoc, IProductDoc } from 'modules/settings/productService/types';
import { tagFactory } from '../tags';

export const productDocFactory = Factory.Sync.makeFactory<IProductDoc>({
  _id: '',
  type: '',
  name: '',
  description: '',
  sku: '',
  createdAt: new Date,
  customFieldsData: {}
});

export const productCategoryDocFactory = Factory.Sync.makeFactory<IProductCategoryDoc>({
  _id: '1',
  name: 'nmma',
  description: 'desc',
  parentId: '2',
});

export const productCategoryFactory = Factory.Sync.makeFactory<IProductCategory>({
  _id: '1',
  name: 'nmma',
  order: '1',
  code: 'code',
  description: 'desc',
  parentId: '1',
  createdAt: new Date,
  productCount: 0,
  isRoot: false
});

export const productFactory = Factory.Sync.makeFactory<IProduct>({
  _id: '1',
  name: 'erxes',
  type: 'type',
  categoryId: '1',
  description: 'desc',
  getTags: [tagFactory.build()],
  sku: '0',
  code: '123',
  unitPrice: 0,
  customFieldsData: {},
  createdAt: new Date,
  category: productCategoryFactory.build()
});