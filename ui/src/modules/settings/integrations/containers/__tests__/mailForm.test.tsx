import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { integrationFactory } from 'modules/testing-utils/factories/settings/integration';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';
import MailForm from '../mail/MailForm';

const integrationsQueryMock = {
  request: {
    query: gql(queries.integrations),
    variables: { kind: 'mail' }
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
    variables: { kind: 'mail' }
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const integrationSendMailMock = {
  request: {
    query: gql(mutations.integrationSendMail)
  },
  result: {
    data: {}
  },
};

const integrationSendMailErrorMock = {
  request: {
    query: gql(mutations.integrationSendMail)
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

describe('MailForm', () => {
  it('should render loading state initially', () => {
    const component = create(
      <MockedProvider mocks={[]}>
        <MailForm />
      </MockedProvider>
    );

    const tree = component.toJSON();
    expect(tree.children).toContain('Loading...');
  });

  it('error', async () => {
    const component = create(
      <MockedProvider
        mocks={[integrationsQueryErrorMock, integrationSendMailErrorMock]}
        addTypename={false}
      >
        <MailForm />
      </MockedProvider>
    );

    await wait(0);

    const tree = component.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const component = create(
      <MockedProvider
        mocks={[integrationsQueryMock, integrationSendMailMock]}
        addTypename={false}
      >
        <MailForm />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = component.toJSON();
    expect(tree).toBe(null);
  });
});
