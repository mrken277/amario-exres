import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { boardFactory } from 'modules/testing-utils/factories/deals';
import { stagesFactory } from 'modules/testing-utils/factories/settings/boards';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import Home from '../Home';

const stagesQueryMock = {
  request: {
    query: gql(queries.stages),
    variables: { pipelineId: '1' }
  },
  result: {
    data: {
      stages: [
        stagesFactory.build(),
        stagesFactory.build({
          _id: '1'
        })
      ]
    }
  }
};

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

const stagesQueryErrorMock = {
  request: {
    query: gql(queries.stages),
    variables: { pipelineId: '1' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
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

describe('BoardHome', () => {
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
        mocks={[stagesQueryErrorMock, boardsQueryErrorMock]}
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
        mocks={[stagesQueryMock, boardsQueryMock]}
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
