import * as Factory from 'factory.ts';
import { IPipeline, IPipelineLabel } from 'modules/boards/types';
import { userFactory } from '../user';

export const pipelineLabelFactory = Factory.Sync.makeFactory<IPipelineLabel>({
  _id: 'string',
  name: 'string',
  colorCode: 'string',
  pipelineId: 'string',
  createdBy: 'string',
  createdAt: new Date
});

export const pipelineFactory = Factory.Sync.makeFactory<IPipeline>({
  _id: 'string',
  name: 'string',
  boardId: 'string',
  visibility: 'string',
  members: [userFactory.build({ _id: '1' })],
  memberIds: [''],
  bgColor: 'string',
  isWatched: true,
  startDate: new Date,
  endDate: new Date,
  metric: 'string',
  hackScoringType: 'string',
  templateId: 'string',
  state: 'string',
  itemsTotalCount: 1,
  isCheckUser: true,
  excludeCheckUserIds: [''],
});