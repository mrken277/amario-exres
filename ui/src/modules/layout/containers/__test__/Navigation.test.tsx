import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { queries } from 'modules/inbox/graphql';
import Navigation from 'modules/layout/containers/Navigation';
import { brandFactory } from 'modules/testing-utils/factories/settings/brands';
import { userConversationFactory, userDetailsFactory, userLinksFactory } from 'modules/testing-utils/factories/user';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';

const currentUser = {
  _id: '12',
  brands: [brandFactory.build({ _id: '12' })],
  // IUserDoc
  username: 'Bataa',
  email: 'bat@nmma.co',
  isActive: true,
  details: userDetailsFactory.build({ fullName: 'Bat Dorj' }),
  isOwner: true,
  status: 'ok',
  links: userLinksFactory.build({ facebook: 'facebook' }),
  getNotificationByEmail: true,
  participatedConversations: [
    userConversationFactory.build({ totalCount: 55 })
  ],
  permissionActions: ['owner', 'visiter']
};

const unreadConversationsMock = {
  request: {
    query: gql(queries.unreadConversationsCount),
    variables: {}
  },
  result: {
    data: {}
  }
};

const unreadConversationsErrorMock = {
  request: {
    query: gql(queries.unreadConversationsCount),
    variables: {}
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('Navigation test', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <Navigation currentUser={currentUser} />
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
        mocks={[unreadConversationsErrorMock]}
        addTypename={false}
      >
        <Navigation currentUser={currentUser} />
      </MockedProvider>
    );

    await wait(0);

    const testInstance = testRenderer.root;
    const span = testInstance.findByType('span');
    expect(span.children).toContain('forced error');
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[unreadConversationsMock]}
        addTypename={false}
      >
        <Navigation currentUser={currentUser} />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
