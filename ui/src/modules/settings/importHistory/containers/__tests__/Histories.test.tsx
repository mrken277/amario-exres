import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { importHistoryItemFactory } from 'modules/testing-utils/factories/settings/importHistory';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';
import Histories from '../Histories';

const historiesQueryMock = {
  request: {
    query: gql(queries.histories),
    variables: { type: 'customer' },
  },
  result: {
    data: {
      importHistories: importHistoryItemFactory.build()
    },
  },
};

const importHistoriesRemoveMocks = {
  request: {
    query: gql(mutations.importHistoriesRemove),
    variables: { _id: '1' },
  },
  result: {
    data: { _id: '1' }
  },
};

const historiesQueryErrorMock = {
  request: {
    query: gql(queries.histories),
    variables: { type: 'customer' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const importHistoriesErrorMock = {
  request: {
    query: gql(mutations.importHistoriesRemove),
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
        <Histories />
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
        mocks={[historiesQueryErrorMock, importHistoriesErrorMock]}
        addTypename={false}
      >
        <Histories />
      </MockedProvider>
    );

    await wait(0);

    const tree = testRenderer.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[historiesQueryMock, importHistoriesRemoveMocks]}
        addTypename={false}
      >
        <Histories />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
