import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { configsDetailFactory } from 'modules/testing-utils/factories';
import * as React from 'react';
import { act, create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';
import ListContainer from '../List';

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

const configQueryMock = {
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

const insertConfigMutationMocks = {
	request: {
		query: gql(mutations.insertConfig),
		variables: { code: '', value: [''] },
	},
	result: {
		data: {
			code: '', value: ['']
		}
	},
};

describe('Account default', () => {
	it('should render loading state initially', () => {
		const component = create(
			<MockedProvider mocks={[]}>
				<ListContainer />
			</MockedProvider>
		);

		const tree = component.toJSON();
		expect(tree.children).toContain('Loading...');
	});

	it('error', async () => {
		const component = create(
			<MockedProvider
				mocks={[insertConfigMutationMocks, configErrorMock]}
				addTypename={false}
			>
				<ListContainer />
			</MockedProvider>
		);

		await act(async () => {
			await wait(0);
		});

		const tree = component.toJSON();
		expect(tree.children).toContain('Error');
	});

	it('should render content', async () => {
		const component = create(
			<MockedProvider
				mocks={[configQueryMock, insertConfigMutationMocks]}
				addTypename={false}
			>
				<ListContainer />
			</MockedProvider>
		);

		await wait(0); // wait for response

		const button = component.root.findByType('button');
		button.props.onClick(); // fires the mutation

		const tree = component.toJSON();
		expect(tree).toBe(null);
	});
});
