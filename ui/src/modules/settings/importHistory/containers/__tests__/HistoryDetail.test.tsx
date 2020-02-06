import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { importHistoryFactory } from 'modules/testing-utils/factories/settings/importHistory';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import HistoryDetail from '../HistoryDetail';

const historyDetailQueryMock = {
  request: {
    query: gql(queries.historyDetail),
    variables: { _id: '1' },
  },
  result: {
    data: {
      importHistoryDetail: importHistoryFactory.build()
    },
  },
};

const historyDetailQueryErrorMock = {
  request: {
    query: gql(queries.historyDetail),
    variables: { _id: '1' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('Account default', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <HistoryDetail id="1" />
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
        mocks={[historyDetailQueryErrorMock]}
        addTypename={false}
      >
        <HistoryDetail id="1" />
      </MockedProvider>
    );

    await wait(0);

    const tree = testRenderer.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[historyDetailQueryMock]}
        addTypename={false}
      >
        <HistoryDetail id="1" />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
