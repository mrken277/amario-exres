import * as Factory from 'factory.ts';
import { IEmailSignature } from 'modules/settings/email/types';

export const emailSignatureFactory = Factory.Sync.makeFactory<IEmailSignature>({
  brandId: 'string',
  signature: 'string'
});