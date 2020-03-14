import * as Factory from 'factory.ts';
import { IItem } from 'modules/boards/types';
import { attachmentFactory } from '../attachment';
import { companyFactory } from '../companies';
import { customerFactory } from '../customer/customer';
import { userFactory } from '../user';
import { pipelineFactory, pipelineLabelFactory } from './pipeline';
import { stageFactory } from './stage';

export const itemFactory = Factory.Sync.makeFactory<IItem>({
  _id: 'string',
  name: 'string',
  order: 1,
  stageId: 'string',
  boardId: 'string',
  closeDate: new Date(),
  description: 'string',
  amount: 1,
  modifiedAt: new Date(),
  assignedUserIds: [''],
  assignedUsers: [userFactory.build({ _id: '' })],
  createdUser: userFactory.build({ _id: '3' }),
  companies: [companyFactory.build({ _id: '3' })],
  customers: [customerFactory.build({ _id: '3' })],
  attachments: [attachmentFactory.build({ name: 'Images1' })],
  labels: [pipelineLabelFactory.build({ _id: '' })],
  pipeline: pipelineFactory.build({ _id: '' }),
  stage: stageFactory.build(),
  isWatched: true,
  priority: 'string',
  hasNotified: true,
  isComplete: true,
  reminderMinute: 1,
  labelIds: [''],
  createdAt: new Date()
});
