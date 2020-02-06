import * as Factory from 'factory.ts';
import { IStage } from 'modules/boards/types';

export const stagesFactory = Factory.Sync.makeFactory<IStage>({
  _id: '1',
  name: 'nmma',
  type: 'deal',
  probability: 'string',
  itemsTotalCount: 0,
  initialDealsTotalCount: 0,
  inProcessDealsTotalCount: 0,
  stayedDealsTotalCount: 0,
  compareNextStage: {
    count: 0,
    percent: 0
  },
  formId: '2',
  pipelineId: '3',
});


