import * as Factory from 'factory.ts';
import { ICurrencies } from "modules/settings/general/types";

export const configsDetailFactory = Factory.Sync.makeFactory<ICurrencies>({
  _id: '1',
  code: 'nmma',
  value: ['']
});