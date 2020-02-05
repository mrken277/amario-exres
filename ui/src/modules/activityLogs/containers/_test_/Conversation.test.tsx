import { MockedProvider, wait } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { queries } from 'modules/inbox/graphql';
import { withRouter } from 'modules/testing-utils/withRouter';
import * as React from 'react';
import { create } from 'react-test-renderer';
import Conversation from '../items/Conversation';

const ActivityLog = {
  _id: '8',
  action: 'add',
  contentId: '11',
  contentType: 'text',
  content: 'any',
  contentDetail: 'any',
  contentTypeDetail: 'any',
  createdAt: new Date(),
  createdBy: 'Chimeg',
  createdByDetail: 'any'
};

const conversationVariables = { _id: '11' };
const activity = ActivityLog;
const conversationId = '55';

const ConversationDetailErrorMock = {
  request: {
    query: gql(queries.conversationDetail),
    variables: conversationVariables
  },
  result: {
    errors: [new GraphQLError('error11')]
  }
};

const MessagesQueryVariables = {
  conversationId: '1',
  limit: 10,
  getFirst: true
};

const MessagesQueryErrorMock = {
  request: {
    query: gql(queries.conversationMessages),
    variables: MessagesQueryVariables
  },
  result: {
    errors: [new GraphQLError('error12')]
  }
};

const FacebookCommentsVariables = {
  postId: '1',
  senderId: '2',
};

const FacebookCommentsErrorMock = {
  request: {
    query: gql(queries.converstationFacebookComments),
    variables: FacebookCommentsVariables
  },
  result: {
    errors: [new GraphQLError('error13')]
  }
};

describe('conversation', () => {
  it('should render loading state initially', () => {
    const component = create(
      <MockedProvider mocks={[]}>
        <Conversation
          activity={activity}
          conversationId={conversationId}
        />
      </MockedProvider>
    );

    const tree = component.toJSON();
    expect(tree.children).toContain('Loading...');
  });

  it('error', async () => {
    const component = create(
      <MockedProvider mocks={[ConversationDetailErrorMock, MessagesQueryErrorMock, FacebookCommentsErrorMock]} addTypename={false}>
        {withRouter(
          <Conversation
            activity={activity}
            conversationId={conversationId}
          />
        )}
      </MockedProvider>
    );

    await wait(0);

    const tree = component.toJSON();
    expect(tree.children).toContain('Error!');
  });

  it('should render content', async () => {
    const component = create(
      <MockedProvider mocks={[]} addTypename={false}>
        {withRouter(
          <Conversation
            activity={activity}
            conversationId={conversationId}
          />
        )}
      </MockedProvider>
    );
    await wait(0);

    const tree = component.toJSON();
    expect(tree).toBe(null);
  });
});
