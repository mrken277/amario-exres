import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { brandFactory } from 'modules/testing-utils/factories/settings/brands';
import { withRouter } from 'modules/testing-utils/withRouter';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import Brands from '../Brands';

const brandDetailQueryMock = {
  request: {
    query: gql(queries.brandDetail),
    variables: { _id: '1' }
  },
  result: {
    data: {
      brandDetail: brandFactory.build()
    }
  }
};

const integrationsCountQueryMock = {
  request: {
    query: gql(queries.integrationsCount),
    variables: { brandId: '1' }
  },
  result: {
    data: {
      integrationsTotalCount: {
        total: 0,
        byKind: {
          messenger: 0
        }
      }
    }
  }
};

const brandDetailErrorMock = {
  request: {
    query: gql(queries.brandDetail),
    variables: { _id: '1' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const integrationsCountErrorMock = {
  request: {
    query: gql(queries.integrationsCount),
    variables: { brandId: '1' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('Brands', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <Brands />
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
        mocks={[brandDetailErrorMock, integrationsCountErrorMock]}
        addTypename={false}
      >
        {withRouter(
          <Brands />
        )}
      </MockedProvider>
    );

    await wait(0);

    const tree = testRenderer.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[integrationsCountQueryMock, brandDetailQueryMock]}
        addTypename={false}
      >
        {withRouter(
          <Brands />
        )}
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
