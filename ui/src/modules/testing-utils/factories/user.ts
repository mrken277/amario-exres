import * as Factory from 'factory.ts';
import { IUser, IUserConversation, IUserDetails, IUserLinks } from 'modules/auth/types';
import { emailSignatureFactory } from './engage';
import { brandFactory } from './settings/brands';

export const userDetailsFactory = Factory.Sync.makeFactory<IUserDetails>({
  avatar: 'images',
  fullName: 'BatDorj',
  shortName: 'Bat',
  description: 'desc',
  position: 'erxes',
  location: 'Mongolia',
  operatorPhone: '77101010'
});

export const userLinksFactory = Factory.Sync.makeFactory<IUserLinks>({
  facebook: 'Facebook',
  twitter: 'twitter',
  linkedIn: 'linkedin',
  youtube: 'youtube',
  github: 'github',
  website: 'website'
});

export const userConversationFactory = Factory.Sync.makeFactory<IUserConversation>({
  list: [1, 2],
  totalCount: 55
});

export const userFactory = Factory.Sync.makeFactory<IUser>({
  _id: '12',
  brands: [
    brandFactory.build({ _id: '12' })
  ],
  emailSignatures: [
    emailSignatureFactory.build({}),
  ],
  // IUserDoc
  username: 'Bataa',
  email: 'bat@nmma.co',
  isActive: true,
  details: userDetailsFactory.build({ fullName: 'Bat Dorj' }),
  isOwner: true,
  status: 'ok',
  links: userLinksFactory.build({ facebook: 'facebook' }),
  getNotificationByEmail: true,
  participatedConversations: [
    userConversationFactory.build({ totalCount: 55 })
  ],
  permissionActions: ['owner', 'visiter']
});
