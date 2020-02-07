import * as Factory from 'factory.ts';
import { IAccount, IIntegration, IMessengerApp, IUiOptions } from 'modules/settings/integrations/types';
import { formFactory } from '../forms';
import { leadDataFactory } from '../leads';
import { messengerDataFactory } from '../messengerdata';
import { brandFactory } from './brands';
import { channelFactory } from './channel';

export const accountFactory = Factory.Sync.makeFactory<IAccount>({
  _id: '1',
  name: 'nmma',
  kind: 'facebook',
  id: '2',
});

export const messengerAppFactory = Factory.Sync.makeFactory<IMessengerApp>({
  _id: '1',
  name: 'nmma',
});

export const uiOptionsFactory = Factory.Sync.makeFactory<IUiOptions>({
  color: '#fcfcfc',
  wallpaper: 'string',
  logo: '/erxes',
  logoPreviewUrl: '/erxes'
});

export const integrationFactory = Factory.Sync.makeFactory<IIntegration>({
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
  uiOptions: uiOptionsFactory.build({
    color: '#fcfcfc',
    wallpaper: 'string',
    logo: '/erxes',
    logoPreviewUrl: '/erxes'
  }),
  leadData: leadDataFactory.build({ loadType: 'string' }),
  brand: brandFactory.build({ _id: '3' }),
  channels: [channelFactory.build(), channelFactory.build({ _id: '25' })],
  isActive: true
});