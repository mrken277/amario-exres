import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { queries as kbQueries } from 'modules/knowledgeBase/graphql';
import { categoryFactory } from 'modules/testing-utils/factories/knowledgebase';
import { integrationFactory } from 'modules/testing-utils/factories/settings/integration';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import KbForm from '../knowledgebase/Form';

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

const topicsQueryMock = {
  request: {
    query: gql(kbQueries.knowledgeBaseTopics)
  },
  result: {
    data: {
      knowledgeBaseCategories: [categoryFactory.build()]
    },
  },
};

const topicsQueryErrorMock = {
  request: {
    query: gql(kbQueries.knowledgeBaseTopics)
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

describe('KbForm', () => {
  it('should render loading state initially', () => {
    const component = create(
      <MockedProvider mocks={[]}>
        <KbForm />
      </MockedProvider>
    );

    const tree = component.toJSON();
    expect(tree.children).toContain('Loading...');
  });

  it('error', async () => {
    const component = create(
      <MockedProvider
        mocks={[integrationsQueryErrorMock, topicsQueryErrorMock]}
        addTypename={false}
      >
        <KbForm />
      </MockedProvider>
    );

    await wait(0);

    const tree = component.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const component = create(
      <MockedProvider
        mocks={[topicsQueryMock, integrationsQueryMock]}
        addTypename={false}
      >
        <KbForm />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = component.toJSON();
    expect(tree).toBe(null);
  });
});
