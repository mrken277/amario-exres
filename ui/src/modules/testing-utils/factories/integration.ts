import * as Factory from 'factory.ts';
import { IIntegration, IUiOptions } from 'modules/settings/integrations/types';
import { brandFactory } from '.';
import { channelFactory } from './channel'
import { formFactory } from './forms';
import { leadDataFactory } from './leads';
import { messengerDataFactory } from './messengerdata';

export const uiOptionsFactory = Factory.Sync.makeFactory<IUiOptions>({
  color: '#fcfcfc',
  wallpaper: 'string',
  logo: '/erxes',
  logoPreviewUrl: '/erxes'
});

export const integrationFacroty = Factory.Sync.makeFactory<IIntegration>({
  _id: '3',
  kind: 'messenger',
  name: 'name',
  brandId: '1',
  code: '45',
  formId: '4',
  languageCode: '2',
  createUrl: '2',
  createModal: '2',
  messengerData: messengerDataFactory.build({ isOnline: true }),
  form: formFactory.build({ _id: '3' }),
  uiOptions: uiOptionsFactory.build({ color: '#fcfcfc', wallpaper: 'string', logo: '/erxes', logoPreviewUrl: '/erxes' }),
  leadData: leadDataFactory.build({ loadType: 'string' }),
  brand: brandFactory.build({ _id: '3' }),
  channels: [
    channelFactory.build(),
    channelFactory.build({ _id: '25' })
  ],
  isActive: true
});
