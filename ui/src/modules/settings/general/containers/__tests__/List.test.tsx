import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { configsDetailFactory } from 'modules/testing-utils/factories';
import * as React from 'react';
import { act, create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import List from '../List';

const configVariables = { code: '' };

const configErrorMock = {
	request: {
		query: gql(queries.configsDetail),
		variables: configVariables,
	},
	result: {
		errors: [new GraphQLError('errorrrrr123!')],
	}
};

const configMock = {
	request: {
		query: gql(queries.configsDetail),
		variables: configVariables,
	},
	result: {
		data: {
			configsDetail: [
				configsDetailFactory.build(),
				configsDetailFactory.build({
					_id: 'id',
					code: 'uom',
					value: ['']
				})
			]
		},
	},
};

describe('Account default', () => {
	it('should render loading state initially', () => {
		const component = create(
			<MockedProvider mocks={[]}>
				<List />
			</MockedProvider>
		);

		const tree = component.toJSON();
		expect(tree.children).toContain('Loading...');
	});

	it('error', async () => {
		const component = create(
			<MockedProvider
				mocks={[configErrorMock]}
				addTypename={false}
			>
				<List />
			</MockedProvider>
		);

		await act(async () => {
			await wait(0);
		});

		const tree = component.toJSON();
		expect(tree.children).toContain('Error!');
	});

	it('should render content', async () => {
		const component = create(
			<MockedProvider
				mocks={[configMock]}
				addTypename={false}
			>
				<List />
			</MockedProvider>
		);

		await wait(0); // wait for response

		const tree = component.toJSON();
		expect(tree).toBe(null);
	});
});
