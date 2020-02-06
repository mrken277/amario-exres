import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { logFactory } from 'modules/testing-utils/factories/settings/logs';
import { withRouter } from 'modules/testing-utils/withRouter';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import queries from '../../queries';
import LogList from '../LogList';

const logsQueryMock = {
  request: {
    query: gql(queries.logs),
    variables: {
      start: 'start',
      end: 'end',
      userId: '1',
      action: '2',
    }
  },
  result: {
    data: {
      logs: logFactory.build()
    }
  }
};

const logsQueryErrorMock = {
  request: {
    query: gql(queries.logs),
    variables: {
      start: 'start',
      end: 'end',
      userId: '1',
      action: '2',
    }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('LogList', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <LogList />
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
        mocks={[logsQueryErrorMock]}
        addTypename={false}
      >
        {withRouter(
          <LogList />
        )}
      </MockedProvider>
    );

    await wait(0);

    const tree = testRenderer.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[logsQueryMock]}
        addTypename={false}
      >
        {withRouter(
          <LogList />
        )}
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
