import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { queries as channelQueries } from 'modules/settings/channels/graphql';
import { userFactory } from 'modules/testing-utils/factories/auth';
import { conversationFactory } from 'modules/testing-utils/factories/conversation';
import { channelFactory } from 'modules/testing-utils/factories/settings/channel';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import UserDetailFormContainer from '../UserDetailForm';

const userDetailQueryMock = {
  request: {
    query: gql(queries.userDetail),
    variables: { _id: '1' },
  },
  result: {
    data: {
      userDetail: [
        userFactory.build(),
        userFactory.build({
          _id: '2'
        })
      ]
    },
  },
};

const userConversationsQueryMock = {
  request: {
    query: gql(queries.userConversations),
    variables: {
      _id: '1',
      perPage: 20
    },
  },
  result: {
    data: {
      userConversations: {
        list: [
          conversationFactory.build(),
          conversationFactory.build({
            _id: '2'
          })
        ],
        totalCount: 0
      }
    },
  },
};

const channelsQueryMock = {
  request: {
    query: gql(channelQueries.channels),
    variables: { _id: '1' },
  },
  result: {
    data: {
      channels: [
        channelFactory.build(),
        channelFactory.build({
          _id: '2'
        })
      ]
    },
  },
};

const userDetailErrorMock = {
  request: {
    query: gql(queries.userDetail),
    variables: { _id: '1' }
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const userConversationsErrorMock = {
  request: {
    query: gql(queries.userConversations),
    variables: { _id: '1', perPage: 20 }
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const channelsErrorMock = {
  request: {
    query: gql(channelQueries.channels),
    variables: { _id: '1' }
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const props = {
  _id: '1',
  queryParams: {}
}

describe('UserDetailForm', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <UserDetailFormContainer {...props} />
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
        mocks={[userDetailErrorMock, userConversationsErrorMock, channelsErrorMock]}
        addTypename={false}
      >
        <UserDetailFormContainer {...props} />
      </MockedProvider>
    );

    await wait(0);

    const tree = testRenderer.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[userDetailQueryMock, userConversationsQueryMock, channelsQueryMock]}
        addTypename={false}
      >
        <UserDetailFormContainer {...props} />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
