import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { integrationFactory } from 'modules/testing-utils/factories/settings/integration';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';
import IntegrationList from '../common/IntegrationList';

const integrationsQueryMock = {
  request: {
    query: gql(queries.integrations),
    variables: { kind: 'facebook' }
  },
  result: {
    data: {
      integrations: [integrationFactory.build()]
    },
  },
};

const integrationsQueryErrorMock = {
  request: {
    query: gql(queries.integrations),
    variables: { kind: 'facebook' }
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const integrationsRemoveMock = {
  request: {
    query: gql(mutations.integrationsRemove),
    variables: { _id: '' },
  },
  result: {
    data: { _id: '' }
  },
};

const integrationsRemoveErrorMock = {
  request: {
    query: gql(mutations.integrationsRemove),
    variables: { _id: '' },
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const integrationsArchiveMock = {
  request: {
    query: gql(mutations.integrationsArchive),
    variables: { _id: '' },
  },
  result: {
    data: { _id: '' }
  },
};

const integrationsArchiveErrorMock = {
  request: {
    query: gql(mutations.integrationsArchive),
    variables: { _id: '' },
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const editCommonFieldsMock = {
  request: {
    query: gql(mutations.integrationsEditCommonFields),
    variables: { _id: '1', brandId: '2', name: 'x' },
  },
  result: {
    data: { _id: '1', brandId: '2', name: 'x' },
  },
};

const editCommonFieldsErrorMock = {
  request: {
    query: gql(mutations.integrationsEditCommonFields),
    variables: { _id: '1', brandId: '2', name: 'x' },
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

describe('IntegrationList', () => {
  it('should render loading state initially', () => {
    const component = create(
      <MockedProvider mocks={[]}>
        <IntegrationList queryParams={''} integrationsCount={0} />
      </MockedProvider>
    );

    const tree = component.toJSON();
    expect(tree.children).toContain('Loading...');
  });

  it('error', async () => {
    const component = create(
      <MockedProvider
        mocks={[integrationsQueryErrorMock, integrationsRemoveErrorMock,
          integrationsArchiveErrorMock, editCommonFieldsErrorMock]}
        addTypename={false}
      >
        <IntegrationList queryParams={''} integrationsCount={0} />
      </MockedProvider>
    );

    await wait(0);

    const tree = component.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const component = create(
      <MockedProvider
        mocks={[editCommonFieldsMock, integrationsArchiveMock,
          integrationsRemoveMock, integrationsQueryMock]}
        addTypename={false}
      >
        <IntegrationList queryParams={''} integrationsCount={0} />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = component.toJSON();
    expect(tree).toBe(null);
  });
});
