import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { boardFactory, pipelineFactory } from 'modules/testing-utils/factories/deals';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';
import Home from '../Home';

const pipelinesQueryMock = {
  request: {
    query: gql(queries.pipelines),
    variables: { boardId: '1' }
  },
  result: {
    data: {
      pipelines: [
        pipelineFactory.build(),
        pipelineFactory.build({
          _id: '1'
        })
      ]
    }
  }
};

const boardDetailQueryMock = {
  request: {
    query: gql(queries.boardDetail),
    variables: { _id: '1' }
  },
  result: {
    data: {
      boardDetail: boardFactory.build()
    }
  }
};

const pipelineRemoveMock = {
  request: {
    query: gql(mutations.pipelineRemove),
    variables: { _id: '1' }
  },
  result: { data: { _id: '1' } }
};

const pipelinesUpdateOrderMock = {
  request: {
    query: gql(mutations.pipelinesUpdateOrder),
    variables: { _id: '1', order: 0 }
  },
  result: { data: { _id: '1', order: 0 } }
};

const pipelinesQueryErrorMock = {
  request: {
    query: gql(queries.pipelines),
    variables: { boardId: '1' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const boardDetailErrorMock = {
  request: {
    query: gql(queries.boardDetail),
    variables: { _id: '1' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const pipelineRemoveErrorMock = {
  request: {
    query: gql(mutations.pipelineRemove),
    variables: { _id: '1' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const pipelinesUpdateOrderErrorMock = {
  request: {
    query: gql(mutations.pipelinesUpdateOrder),
    variables: { _id: '1', order: 0 }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('Pipelines', () => {
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
        mocks={[pipelinesUpdateOrderErrorMock, pipelineRemoveErrorMock, boardDetailErrorMock, pipelinesQueryErrorMock]}
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
        mocks={[pipelinesUpdateOrderMock, pipelineRemoveMock, boardDetailQueryMock, pipelinesQueryMock]}
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
