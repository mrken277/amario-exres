import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { queries as brandQueries } from 'modules/settings/brands/graphql';
import { queries as teamQueries } from 'modules/settings/team/graphql';
import { userFactory } from 'modules/testing-utils/factories/auth';
import { brandFactory } from 'modules/testing-utils/factories/settings/brands';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import Signature from '../Signature';

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

const userDetailQueryMock = {
  request: {
    query: gql(teamQueries.userDetail),
    variables: { _id: '1' }
  },
  result: {
    data: {
      userDetail: userFactory.build()
    }
  }
};

const userDetailQueryErrorMock = {
  request: {
    query: gql(teamQueries.userDetail),
    variables: { _id: '1' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('Signature', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <Signature />
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
        mocks={[brandsQueryErrorMock, userDetailQueryErrorMock]}
        addTypename={false}
      >
        <Signature />
      </MockedProvider>
    );

    await wait(0);

    const tree = testRenderer.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[brandsQueryMock, userDetailQueryMock]}
        addTypename={false}
      >
        <Signature />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
