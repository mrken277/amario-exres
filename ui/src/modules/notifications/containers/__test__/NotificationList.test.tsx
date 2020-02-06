import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import NotificationList from 'modules/notifications/containers/NotificationList';
import { notificationFactory } from 'modules/testing-utils/factories/notifications';
import { withRouter } from 'modules/testing-utils/withRouter';
import * as React from 'react';
import { act, create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';

const queryParams = {
  type: 'string'
};

const notificationsMock = {
  request: {
    query: gql(queries.notifications),
    variables: { requireRead: true, page: 1, perPage: 20, title: 'string' }
  },
  result: {
    data: {
      notifications: [
        notificationFactory.build(),
        notificationFactory.build({
          _id: '3'
        })
      ]
    }
  }
};

const notificationsErrorMock = {
  request: {
    query: gql(queries.notifications),
    variables: { requireRead: true, page: 1, perPage: 20, title: 'string' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const notificationCountMock = {
  request: {
    query: gql(queries.notificationCounts),
    variables: { requireRead: false }
  },
  result: {
    data: {
      notificationCounts: 10
    }
  }
};

const notificationCountErrorMock = {
  request: {
    query: gql(queries.notificationCounts),
    variables: { requireRead: false }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const MarkAsReadMutationMock = {
  request: {
    query: gql(mutations.markAsRead),
    variables: { _ids: ['1'] },
  },
  result: {
    data: {
      _ids: ['1']
    }
  }
};

const MarkAsReadMutationErrorMock = {
  request: {
    query: gql(mutations.markAsRead),
    variables: { _ids: ['1'] },
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};


describe('Summary Report', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <NotificationList queryParams={queryParams} />
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
        mocks={[notificationsErrorMock, notificationCountErrorMock, MarkAsReadMutationErrorMock]}
        addTypename={false}
      >
        {withRouter(
          <NotificationList queryParams={queryParams} />
        )}
      </MockedProvider>
    );

    await act(async () => {
      await wait(0);
    });

    const testInstance = testRenderer.root;
    const span = testInstance.findByType('span');
    expect(span).toContain('forced error');
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[notificationsMock, notificationCountMock, MarkAsReadMutationMock]}
        addTypename={false}
      >
        {withRouter(
          <NotificationList queryParams={queryParams} />
        )}
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
