import * as Factory from 'factory.ts';
import { IForm } from 'modules/forms/types';
import { userFactory } from './user';

export const formFactory = Factory.Sync.makeFactory<IForm>({
  _id: '3',
  title: 'form1',
  code: 'string',
  type: 'form1',
  description: 'form1',
  buttonText: 'form1',
  createdUserId: 'form1',
  createdUser: userFactory.build({ _id: '12', email: 'erxes@nmma.co' }),
  createdDate: new Date()
});