import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import Store from '../Store';

const integrationTotalCountQueryMock = {
  request: {
    query: gql(queries.integrationTotalCount)
  },
  result: {
    data: {
      integrationsTotalCount: { total: 0 }
    },
  },
};

const integrationTotalCountErrorMock = {
  request: {
    query: gql(queries.integrationTotalCount)
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

describe('Store', () => {
  it('should render loading state initially', () => {
    const component = create(
      <MockedProvider mocks={[]}>
        <Store queryParams='' />
      </MockedProvider>
    );

    const tree = component.toJSON();
    expect(tree.children).toContain('Loading...');
  });

  it('error', async () => {
    const component = create(
      <MockedProvider
        mocks={[integrationTotalCountErrorMock]}
        addTypename={false}
      >
        <Store queryParams='' />
      </MockedProvider>
    );

    await wait(0);

    const tree = component.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const component = create(
      <MockedProvider
        mocks={[integrationTotalCountQueryMock]}
        addTypename={false}
      >
        <Store queryParams='' />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = component.toJSON();
    expect(tree).toBe(null);
  });
});
