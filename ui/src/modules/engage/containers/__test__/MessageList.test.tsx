import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { engageMessageFactory } from 'modules/testing-utils/factories/engage';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import MessageList from '../MessageList';

const type = 'string';
const queryParams = 'string';
const loading = true;

const listQueryVariables = {
  page: 3,
  perPage: 3,
  kind: 'string',
  status: 'string',
  tag: 'string',
  ids: ['string']
};

const engageMessageDetailMock = {
  request: {
    query: gql(queries.engageMessageDetail),
    variables: listQueryVariables
  },
  result: {
    data: {
      EngageMessageDetail: [
        engageMessageFactory.build(),
        engageMessageFactory.build({
          _id: '3'
        })
      ]
    }
  }
};

const engageMessagesTotalCountMock = {
  request: {
    query: gql(queries.engageMessagesTotalCount),
    variables: listQueryVariables
  },
  result: {
    data: {
      engageMessagesTotalCount: 3
    }
  }
};

const engageMessagesTotalCountErrorMock = {
  request: {
    query: gql(queries.engageMessagesTotalCount),
    variables: listQueryVariables
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('MessageList', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <MessageList type={type} queryParams={queryParams} loading={loading} />
      </MockedProvider>
    );

    const testInstance = testRenderer.root;
    const loader = testInstance.findByProps({ objective: true }).type;

    const spinner = loader({});

    expect(spinner.props.objective).toEqual(false);
  });

  it('should show error', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[engageMessagesTotalCountErrorMock, engageMessageDetailMock]}
        addTypename={false}
      >
        <MessageList type={type} queryParams={queryParams} loading={loading} />
      </MockedProvider>
    );

    const testInstance = testRenderer.root;
    const span = testInstance.findByType('span');
    expect(span.children).toContain('forced error');
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[engageMessagesTotalCountMock, engageMessageDetailMock]}
        addTypename={false}
      >
        <MessageList type={type} queryParams={queryParams} loading={loading} />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
