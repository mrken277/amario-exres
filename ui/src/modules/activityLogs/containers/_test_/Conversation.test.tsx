import { MockedProvider, wait } from '@apollo/react-testing';
import { act } from '@testing-library/react';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { queries } from 'modules/inbox/graphql';
import { withRouter } from 'modules/testing-utils/withRouter';
import * as React from 'react';
import { create } from 'react-test-renderer';
import Conversation from '../items/Conversation';

const conversationVariables = { _id: '11' };

const ConversationDetailErrorMock = {
  request: {
    query: gql(queries.conversationDetail),
    variables: conversationVariables
  },
  result: {
    errors: [new GraphQLError('forced error')]
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
    errors: [new GraphQLError('forced error')]
  }
};


describe('conversation', () => {
  it('should render loading state initially', () => {
    const component = create(
      <MockedProvider mocks={[]}>
        <Conversation

        />
      </MockedProvider>
    );

    const tree = component.toJSON();
    expect(tree.children).toContain('Loading...');
  });

  it('error', async () => {
    const component = create(
      <MockedProvider mocks={[ConversationDetailErrorMock, MessagesQueryErrorMock]} addTypename={false}>
        {withRouter(
          <Conversation

          />
        )}
      </MockedProvider>
    );

    await act(async () => {
      await wait(0);
    });

    const tree = component.toJSON();
    expect(tree.children).toContain('Error!');
  });

  it('should render content', async () => {
    const component = create(
      <MockedProvider mocks={[]} addTypename={false}>
        {withRouter(
          <Conversation

          />
        )}
      </MockedProvider>
    );
    await wait(0);

    const tree = component.toJSON();
    expect(tree).toBe(null);
  });
});
