import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { topicFactory } from 'modules/testing-utils/knowledgebase'
import * as React from 'react';
import { act, create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';
import KnowledgeList from '../knowledge/KnowledgeList'

const queryParams = 'any';
const currentCategoryId = 'string';
const articlesCount = 3;

const topicsMock = {
  request: {
    query: gql(queries.knowledgeBaseTopics),
    variables: { page: 1, perPage: 20 }
  },
  result: {
    data: {
      topics: [
        topicFactory.build(),
        topicFactory.build({
          _id: '2',
          title: 'title',
        })
      ]
    }
  }
};

const topicsErrorMock = {
  request: {
    query: gql(queries.knowledgeBaseTopics),
    variables: { page: 1, perPage: 20 }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const topicsCountMock = {
  request: {
    query: gql(queries.knowledgeBaseTopicsTotalCount),
    variables: {}
  },
  result: {
    data: {
      topicsCount: {
        knowledgeBaseTopicsTotalCount: 11
      }
    }
  }
};

const topicsCountErrorMock = {
  request: {
    query: gql(queries.knowledgeBaseTopicsTotalCount),
    variables: {}
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const RemoveTopicsMock = {
  request: {
    query: gql(mutations.knowledgeBaseTopicsRemove),
    variables: { _id: '' }
  },
  result: {
    data: {
      _id: ''
    }
  }
};

const RemoveTopicsErrorMock = {
  request: {
    query: gql(mutations.knowledgeBaseTopicsRemove),
    variables: { _id: '' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('KnowledgeList', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <KnowledgeList queryParams={queryParams} currentCategoryId={currentCategoryId} articlesCount={articlesCount} />
      </MockedProvider>
    );

    const testInstance = testRenderer.root;
    const loader = testInstance.findByProps({ objective: true }).type;

    const spinner = loader({});

    expect(spinner.props.objective).toEqual(false);
  });

  it('should show error', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[RemoveTopicsErrorMock, topicsErrorMock, topicsCountErrorMock]}
        addTypename={false}
      >
        <KnowledgeList queryParams={queryParams} history={history} />
      </MockedProvider>
    );

    await wait(0);

    const testInstance = testRenderer.root;
    const span = testInstance.findByType('span');
    expect(span.children).toContain('forced error');
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[topicsMock, RemoveTopicsMock, topicsCountMock]}
        addTypename={false}
      >
        <KnowledgeList queryParams={queryParams} history={history} />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
