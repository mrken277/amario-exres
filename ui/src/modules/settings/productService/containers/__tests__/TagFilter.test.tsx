import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { queries as tagQueries } from 'modules/tags/graphql';
import { tagFactory } from 'modules/testing-utils/factories/tags';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import TagFilter from '../TagFilter';

const countByTagsQueryMock = {
  request: {
    query: gql(queries.productCountByTags)
  },
  result: {
    data: {
      productCountByTags: { 'key': 0 }
    },
  },
};

const countByTagsQueryErrorMock = {
  request: {
    query: gql(queries.productCountByTags)
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const tagsQueryMock = {
  request: {
    query: gql(tagQueries.tags),
    variables: { type: 'lead' },
  },
  result: {
    data: {
      tags: [tagFactory.build()]
    },
  },
};

const tagsQueryErrorMock = {
  request: {
    query: gql(tagQueries.tags),
    variables: { type: 'lead' },
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

describe('Tag Filter', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <TagFilter />
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
        mocks={[countByTagsQueryErrorMock, tagsQueryErrorMock]}
        addTypename={false}
      >
        <TagFilter />
      </MockedProvider>
    );

    await wait(0);

    const tree = testRenderer.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[countByTagsQueryMock, tagsQueryMock]}
        addTypename={false}
      >
        <TagFilter />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
