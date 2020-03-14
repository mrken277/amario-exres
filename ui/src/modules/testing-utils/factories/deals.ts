import * as Factory from 'factory.ts';
import { IBoard, IPipeline } from 'modules/boards/types';
import { IDeal } from 'modules/deals/types';
import { userFactory } from './auth';
import { stageFactory } from './boards/stage';
import { companyFactory } from './companies';
import { customerFactory } from './customer/customer';

export const boardFactory = Factory.Sync.makeFactory<IBoard>({
  _id: '1',
  name: 'New Board'
});

const board = boardFactory.build();

export const pipelineFactory = Factory.Sync.makeFactory<IPipeline>({
  _id: '1',
  name: 'new Pipeline',
  boardId: board._id,
  visibility: 'public',
  isWatched: true
});

const stage = stageFactory.build();
const user = userFactory.build();
const company = companyFactory.build();
const customer = customerFactory.build();
const pipeline = pipelineFactory.build();

const dealItem = {
  _id: '1',
  name: 'New Item',
  order: 2,
  stageId: stage._id,
  boardId: board._id,
  closeDate: new Date(),
  description: 'string',
  amount: 300,
  modifiedAt: new Date(),
  assignedUsers: [user],
  companies: [company],
  customers: [customer],
  labels: [],
  pipeline,
  isComplete: false,
  reminderMinute: 20,
  labelIds: [],
  createdAt: new Date()
};

export const dealFactory = Factory.Sync.makeFactory<IDeal>(dealItem);
