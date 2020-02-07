import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { categoryFactory } from 'modules/testing-utils/factories/knowledgebase';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import KnowledgeBase from '../KnowledgeBase'

// const queryParams = 'any';
// const currentCategoryId = 'string';

const categoryDetailMock = {
  request: {
    query: gql(queries.knowledgeBaseCategoryDetail),
    variables: { _id: '' }
  },
  result: {
    data: {
      categoryDetail: [
        categoryFactory.build(),
        categoryFactory.build({
          _id: '1'
        })
      ]
    }
  }
};

const categoryDetailErrorMock = {
  request: {
    query: gql(queries.knowledgeBaseTopics),
    variables: { _id: '' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const articlesCountMock = {
  request: {
    query: gql(queries.knowledgeBaseArticlesTotalCount),
    variables: { categoryIds: [''] }
  },
  result: {
    data: {
      articlesCount: {
        knowledgeBaseArticlesTotalCount: 11
      }
    }
  }
};

const articlesCountErrorMock = {
  request: {
    query: gql(queries.knowledgeBaseArticlesTotalCount),
    variables: { categoryIds: [''] }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('KnowledgeList', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <KnowledgeBase />
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
        mocks={[categoryDetailErrorMock, articlesCountErrorMock]}
        addTypename={false}
      >
        <KnowledgeBase />
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
        mocks={[categoryDetailMock, articlesCountMock]}
        addTypename={false}
      >
        <KnowledgeBase />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
