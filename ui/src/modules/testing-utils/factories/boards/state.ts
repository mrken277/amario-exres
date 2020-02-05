import * as Factory from 'factory.ts';
import { IStage, IStageComparisonInfo } from 'modules/boards/types';

export const stateComparisonFactory = Factory.Sync.makeFactory<IStageComparisonInfo>({
  count: 1,
  percent: 1,
});

export const stateFactory = Factory.Sync.makeFactory<IStage>({
  _id: 'string',
  name: 'string',
  type: 'string',
  probability: 'string',
  index: 1,
  itemId: 'string',
  amount: 'any',
  itemsTotalCount: 1,
  initialDealsTotalCount: 1,
  inProcessDealsTotalCount: 1,
  stayedDealsTotalCount: 1,
  compareNextStage: stateComparisonFactory.build({ count: 1 }),
  formId: 'string',
  pipelineId: 'string',
});