import * as Factory from 'factory.ts';
import { IEmailTemplate } from 'modules/settings/emailTemplates/types';

export const emailTemplateFactory = Factory.Sync.makeFactory<IEmailTemplate>({
  _id: '1',
  name: 'nmma',
  content: ''
});
