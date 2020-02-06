import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { importHistoryFactory } from 'modules/testing-utils/factories/settings/importHistory';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';
import HistoryDetail from '../HistoryDetail';

const importHistoryDetailQueryMock = {
  request: {
    query: gql(queries.historyDetailForLoad),
    variables: { _id: '1' },
  },
  result: {
    data: {
      importHistoryDetail: importHistoryFactory.build()
    },
  },
};

const importCancelMock = {
  request: {
    query: gql(mutations.importCancel),
    variables: { _id: '1' },
  },
  result: {
    data: { id: '1' },
  },
};

const importHistoryDetailQueryErrorMock = {
  request: {
    query: gql(queries.historyDetail),
    variables: { _id: '1' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const importCancelErrorMock = {
  request: {
    query: gql(mutations.importCancel),
    variables: { _id: '1' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('Import indicator', () => {
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
        mocks={[importHistoryDetailQueryErrorMock, importCancelErrorMock]}
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
        mocks={[importCancelMock, importHistoryDetailQueryMock]}
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
