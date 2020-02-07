import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { queries as brandQueries } from 'modules/settings/brands/graphql';
import { brandFactory } from 'modules/testing-utils/factories/settings/brands';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import List from '../List';

const brandsQueryMock = {
  request: {
    query: gql(brandQueries.brands)
  },
  result: {
    data: {
      brands: [brandFactory.build()]
    }
  }
};

const brandsQueryErrorMock = {
  request: {
    query: gql(brandQueries.brands)
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('List', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <List />
      </MockedProvider>
    );

    const testInstance = testRenderer.root;
    const loader = testInstance.findByProps({ objective: true }).type;

    const spinner = loader({});

    expect(spinner.props.objective).toEqual(false);
  });

  it('error', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[brandsQueryErrorMock]}
        addTypename={false}
      >
        <List />
      </MockedProvider>
    );

    await wait(0);

    const tree = testRenderer.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[brandsQueryMock]}
        addTypename={false}
      >
        <List />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
