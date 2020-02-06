import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { accountFactory } from 'modules/testing-utils/factories/settings/integration';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';
import MessengerAppList from '../MessengerAppList';

const fetchApiQueryMock = {
  request: {
    query: gql(queries.fetchApi),
    variables: { path: '/accounts', params: { kind: 'fb' } }
  },
  result: {
    data: {
      integrationsFetchApi: [accountFactory.build()]
    },
  },
};

const fetchApiErrorMock = {
  request: {
    query: gql(queries.fetchApi),
    variables: { path: '/accounts', params: { kind: 'fb' } }
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const removeAccountMock = {
  request: {
    query: gql(mutations.removeAccount),
    variables: { _id: '' },
  },
  result: {
    data: { _id: '' }
  },
};

const removeAccountErrorMock = {
  request: {
    query: gql(mutations.removeAccount),
    variables: { _id: '' },
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

describe('MessengerAppList', () => {
  it('should render loading state initially', () => {
    const component = create(
      <MockedProvider mocks={[]}>
        <MessengerAppList queryParams={''} />
      </MockedProvider>
    );

    const tree = component.toJSON();
    expect(tree.children).toContain('Loading...');
  });

  it('error', async () => {
    const component = create(
      <MockedProvider
        mocks={[fetchApiErrorMock, removeAccountErrorMock]}
        addTypename={false}
      >
        <MessengerAppList queryParams={''} />
      </MockedProvider>
    );

    await wait(0);

    const tree = component.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const component = create(
      <MockedProvider
        mocks={[fetchApiQueryMock, removeAccountMock]}
        addTypename={false}
      >
        <MessengerAppList queryParams={''} />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = component.toJSON();
    expect(tree).toBe(null);
  });
});
