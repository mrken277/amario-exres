import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { queries as kbQueries } from 'modules/knowledgeBase/graphql';
import { queries as integrationQueries } from 'modules/settings/integrations/graphql';
import { topicFactory } from 'modules/testing-utils/factories/knowledgebase';
import { integrationFactory } from 'modules/testing-utils/factories/settings/integration';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import Form from '../Form';

const integrationsQueryMock = {
  request: {
    query: gql(integrationQueries.integrations)
  },
  result: {
    data: {
      integrations: [integrationFactory.build()]
    }
  }
};

const integrationsQueryErrorMock = {
  request: {
    query: gql(integrationQueries.integrations)
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const kbTopicsQueryMock = {
  request: {
    query: gql(kbQueries.knowledgeBaseTopics)
  },
  result: {
    data: {
      knowledgeBaseTopics: [topicFactory.build()]
    }
  }
};

const kbTopicsQueryErrorMock = {
  request: {
    query: gql(kbQueries.knowledgeBaseTopics)
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('Form', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <Form />
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
        mocks={[integrationsQueryErrorMock, kbTopicsQueryErrorMock]}
        addTypename={false}
      >
        <Form />
      </MockedProvider>
    );

    await wait(0);

    const tree = testRenderer.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[integrationsQueryMock, kbTopicsQueryMock]}
        addTypename={false}
      >
        <Form />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
