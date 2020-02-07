import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { boardFactory } from 'modules/testing-utils/factories/deals';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';
import Home from '../Home';

const boardsQueryMock = {
  request: {
    query: gql(queries.boards),
    variables: { type: 'deal' }
  },
  result: {
    data: {
      boards: [
        boardFactory.build(),
        boardFactory.build({
          _id: '1'
        })
      ]
    }
  }
};

const boardRemoveMutationMock = {
  request: {
    query: gql(mutations.boardRemove),
    variables: { _id: '1' }
  },
  result: { data: { _id: '1' } }
};

const boardsQueryErrorMock = {
  request: {
    query: gql(queries.boards),
    variables: { type: 'deal' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const boardRemoveErrorMock = {
  request: {
    query: gql(mutations.boardRemove),
    variables: { type: 'deal' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('Boards', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <Home type="" title="" />
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
        mocks={[boardsQueryErrorMock, boardRemoveErrorMock]}
        addTypename={false}
      >
        <Home type="" title="" />
      </MockedProvider>
    );

    await wait(0);

    const tree = testRenderer.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[boardsQueryMock, boardRemoveMutationMock]}
        addTypename={false}
      >
        <Home type="" title="" />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
