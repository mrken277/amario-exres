import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import StoreEntry from '../StoreEntry';

const messengerAppsCountQueryMock = {
  request: {
    query: gql(queries.messengerAppsCount),
    variables: { kind: 'facebook' }
  },
  result: {
    data: {
      messengerAppsCount: 0
    },
  },
};

const messengerAppsCountErrorMock = {
  request: {
    query: gql(queries.messengerAppsCount),
    variables: { kind: 'facebook' }
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

describe('StoreEntry', () => {
  it('should render loading state initially', () => {
    const component = create(
      <MockedProvider mocks={[]}>
        <StoreEntry />
      </MockedProvider>
    );

    const tree = component.toJSON();
    expect(tree.children).toContain('Loading...');
  });

  it('error', async () => {
    const component = create(
      <MockedProvider
        mocks={[messengerAppsCountErrorMock]}
        addTypename={false}
      >
        <StoreEntry />
      </MockedProvider>
    );

    await wait(0);

    const tree = component.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const component = create(
      <MockedProvider
        mocks={[messengerAppsCountQueryMock]}
        addTypename={false}
      >
        <StoreEntry />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = component.toJSON();
    expect(tree).toBe(null);
  });
});
