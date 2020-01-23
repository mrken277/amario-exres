import * as Factory from 'factory.ts';
import { IUser, IUserConversation, IUserDetails, IUserLinks } from 'modules/auth/types';
import { brandFactory } from './settings/brands';
import { emailSignatureFactory } from './settings/emails';

export const userConversationFactory = Factory.Sync.makeFactory<IUserConversation>({
	list: [],
	totalCount: 0
});

export const userDetailsFactory = Factory.Sync.makeFactory<IUserDetails>({
	avatar: 'string',
	fullName: 'string',
	shortName: 'string',
	description: 'string',
	position: 'string',
	location: 'string',
	operatorPhone: 'string'
});

export const userLinksFactory = Factory.Sync.makeFactory<IUserLinks>({
	facebook: 'string',
	twitter: 'string',
	linkedIn: 'string',
	youtube: 'string',
	github: 'string',
	website: 'string'
});

export const userFactory = Factory.Sync.makeFactory<IUser>({
	_id: 'string',
	brands: [
		brandFactory.build(),
		brandFactory.build({ _id: '1' })
	],
	emailSignatures: [
		emailSignatureFactory.build(),
		emailSignatureFactory.build({ brandId: '1' })
	],
	username: 'string',
	email: 'string',
	isActive: false,
	details: (
		userDetailsFactory.build(),
		userDetailsFactory.build({ avatar: 'img' })
	),
	isOwner: false,
	status: 'string',
	links: (
		userLinksFactory.build(),
		userLinksFactory.build({ facebook: 'facebook' })
	),
	getNotificationByEmail: false,
	participatedConversations: [
		userConversationFactory.build(),
		userConversationFactory.build({ totalCount: 0 })
	],
	permissionActions: [''],
});
