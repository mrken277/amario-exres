import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { boardFactory } from 'modules/testing-utils/factories/deals';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import Home from '../Home';

const boardGetLastQueryMock = {
  request: {
    query: gql(queries.boardGetLast),
    variables: { type: 'deal' }
  },
  result: {
    data: {
      boardGetLast: boardFactory.build()
    }
  }
};

const boardGetLastErrorMock = {
  request: {
    query: gql(queries.boardGetLast),
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
        mocks={[boardGetLastErrorMock]}
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
        mocks={[boardGetLastQueryMock]}
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
