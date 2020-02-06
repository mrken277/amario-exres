import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { messengerAppFactory } from 'modules/testing-utils/factories/settings/integration';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';
import MessengerAppList from '../MessengerAppList';

const messengerAppsQueryMock = {
  request: {
    query: gql(queries.messengerApps),
    variables: { kind: 'facebook' }
  },
  result: {
    data: {
      messengerApps: [messengerAppFactory.build()]
    },
  },
};

const messengerAppsQueryErrorMock = {
  request: {
    query: gql(queries.messengerApps),
    variables: { kind: 'facebook' }
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const messengerAppsRemoveMock = {
  request: {
    query: gql(mutations.messengerAppsRemove),
    variables: { _id: '' },
  },
  result: {
    data: { _id: '' }
  },
};

const messengerAppsRemoveErrorMock = {
  request: {
    query: gql(mutations.messengerAppsRemove),
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
        mocks={[messengerAppsQueryErrorMock, messengerAppsRemoveErrorMock]}
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
        mocks={[messengerAppsQueryMock, messengerAppsRemoveMock]}
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
