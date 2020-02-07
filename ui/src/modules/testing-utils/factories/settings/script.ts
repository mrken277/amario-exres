import * as Factory from 'factory.ts';
import { IResponseTemplate } from 'modules/settings/responseTemplates/types';
import { brandFactory } from './brands';

export const responseTemplateFactory = Factory.Sync.makeFactory<IResponseTemplate>({
    _id: '1',
    name: 'string',
    content: '',
    brandId: '1',
    brand: brandFactory.build(),
    files: {}
});
