import * as Factory from 'factory.ts';
import { IConditionsRule } from 'modules/common/types';

export const conditionsRuleFactory = Factory.Sync.makeFactory<IConditionsRule>({
  _id: '1',
  kind: 'string',
  text: 'string',
  condition: 'string',
  value: 'string',
});