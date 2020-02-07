import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { integrationFactory } from 'modules/testing-utils/factories/settings/integration';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import LeadForm from '../lead/Form';

const integrationsQueryMock = {
  request: {
    query: gql(queries.integrations),
    variables: { kind: 'messenger' }
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
    variables: { kind: 'messenger' }
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

describe('LeadForm', () => {
  it('should render loading state initially', () => {
    const component = create(
      <MockedProvider mocks={[]}>
        <LeadForm />
      </MockedProvider>
    );

    const tree = component.toJSON();
    expect(tree.children).toContain('Loading...');
  });

  it('error', async () => {
    const component = create(
      <MockedProvider
        mocks={[integrationsQueryErrorMock]}
        addTypename={false}
      >
        <LeadForm />
      </MockedProvider>
    );

    await wait(0);

    const tree = component.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const component = create(
      <MockedProvider
        mocks={[integrationsQueryMock]}
        addTypename={false}
      >
        <LeadForm />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = component.toJSON();
    expect(tree).toBe(null);
  });
});
