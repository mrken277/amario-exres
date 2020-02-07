import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { brandFactory } from 'modules/testing-utils/factories/settings/brands';
import { withRouter } from 'modules/testing-utils/withRouter';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';
import Brands from '../Brands';

const brandsQueryMock = {
  request: {
    query: gql(queries.brands),
    variables: { _id: '1' }
  },
  result: {
    data: {
      brands: [
        brandFactory.build(),
        brandFactory.build({
          _id: '1'
        })
      ]
    }
  }
};

const integrationsCreateMessengerMock = {
  request: {
    query: gql(mutations.integrationsCreateMessenger),
    variables: { name: 'nmma', brandId: '1' }
  },
  result: { data: {} }
};

const integrationsEditMessengerMock = {
  request: {
    query: gql(mutations.integrationsEditMessenger),
    variables: { name: 'nmma', brandId: '1' }
  },
  result: { data: {} }
};

const brandsQueryErrorMock = {
  request: {
    query: gql(queries.brands),
    variables: { _id: '1' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const integrationsCreateMessengerErrorMock = {
  request: {
    query: gql(mutations.integrationsCreateMessenger),
    variables: { name: 'nmma', brandId: '1' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const integrationsEditMessengerErrorMock = {
  request: {
    query: gql(mutations.integrationsEditMessenger),
    variables: { name: 'nmma', brandId: '1' }
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
        mocks={[brandsQueryErrorMock, integrationsCreateMessengerErrorMock,
          integrationsEditMessengerErrorMock]}
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
        mocks={[brandsQueryMock, integrationsCreateMessengerMock,
          integrationsEditMessengerMock]}
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
