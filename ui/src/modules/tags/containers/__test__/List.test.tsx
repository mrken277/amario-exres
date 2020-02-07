import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { tagFactory } from 'modules/testing-utils/factories/tags';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';
import ListContainer from '../List';

const variables = { type: 'tagtype' };

const configErrorMock = {
  request: {
    query: gql(queries.tags),
    variables,
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const configQueryMock = {
  request: {
    query: gql(queries.tags),
    variables,
  },
  result: {
    data: {
      tags: [
        tagFactory.build(),
        tagFactory.build({
          _id: 'id'
        })
      ]
    },
  },
};

const removeTagMutationMocks = {
  request: {
    query: gql(mutations.remove),
    variables: { ids: [''] },
  },
  result: {
    data: { ids: [' '] }
  },
};

describe('Account default', () => {
  it('should render loading state initially', () => {
    const component = create(
      <MockedProvider mocks={[]}>
        <ListContainer type="" />
      </MockedProvider>
    );

    const tree = component.toJSON();
    expect(tree.children).toContain('Loading...');
  });

  it('error', async () => {
    const component = create(
      <MockedProvider
        mocks={[configErrorMock]}
        addTypename={false}
      >
        <ListContainer type="" />
      </MockedProvider>
    );

    await wait(0);

    const tree = component.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const component = create(
      <MockedProvider
        mocks={[configQueryMock, removeTagMutationMocks]}
        addTypename={false}
      >
        <ListContainer type="" />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = component.toJSON();
    expect(tree).toBe(null);
  });
});
