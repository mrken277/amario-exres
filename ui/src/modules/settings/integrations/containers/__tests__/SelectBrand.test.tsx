import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { queries as brandQueries } from 'modules/settings/brands/graphql';
import { brandFactory } from 'modules/testing-utils/factories/settings/brands';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import SelectBrand from '../SelectBrand';

const brandsQueryMock = {
  request: {
    query: gql(brandQueries.brands)
  },
  result: {
    data: {
      brands: [brandFactory.build()]
    },
  },
};

const brandsQueryErrorMock = {
  request: {
    query: gql(brandQueries.brands)
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

describe('SelectBrand', () => {
  it('should render loading state initially', () => {
    const component = create(
      <MockedProvider mocks={[]}>
        <SelectBrand />
      </MockedProvider>
    );

    const tree = component.toJSON();
    expect(tree.children).toContain('Loading...');
  });

  it('error', async () => {
    const component = create(
      <MockedProvider
        mocks={[brandsQueryErrorMock]}
        addTypename={false}
      >
        <SelectBrand />
      </MockedProvider>
    );

    await wait(0);

    const tree = component.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const component = create(
      <MockedProvider
        mocks={[brandsQueryMock]}
        addTypename={false}
      >
        <SelectBrand />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = component.toJSON();
    expect(tree).toBe(null);
  });
});
