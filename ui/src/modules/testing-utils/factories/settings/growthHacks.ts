import * as Factory from 'factory.ts';
import { IPipelineTemplate, IPipelineTemplateStage } from 'modules/settings/growthHacks/types';

export const pipelineTemplateStage = Factory.Sync.makeFactory<IPipelineTemplateStage>({
  name: 'name',
  formId: '1',
  order: 0
});

export const pipelineTemplateFactory = Factory.Sync.makeFactory<IPipelineTemplate>({
  _id: '',
  name: '',
  description: '',
  type: '',
  stages: [pipelineTemplateStage.build()]
});


