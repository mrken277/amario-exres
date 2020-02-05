import * as Factory from 'factory.ts';
import { IEmailSignature, IEmailSignatureWithBrand } from 'modules/settings/email/types';

export const emailSignatureFactory = Factory.Sync.makeFactory<IEmailSignature>({
  brandId: 'string',
  signature: 'string'
});

export const emailSignatureWithBrandFactory = Factory.Sync.makeFactory<IEmailSignatureWithBrand>({
  brandId: 'string',
  signature: 'string',
  brandName: 'name'
});