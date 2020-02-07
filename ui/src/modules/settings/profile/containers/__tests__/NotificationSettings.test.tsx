import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { notificationConfigFactory, notificationModuleFactory } from 'modules/testing-utils/factories/notifications';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';
import NotificationSettings from '../NotificationSettings';

const notificationsModulesQueryMock = {
  request: {
    query: gql(queries.notificationsModules)
  },
  result: {
    data: {
      notificationsModules: [notificationModuleFactory.build()]
    },
  },
};

const notificationsModulesQueryErrorMock = {
  request: {
    query: gql(queries.notificationsModules)
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const notificationsGetConfigurationsMock = {
  request: {
    query: gql(queries.notificationsGetConfigurations)
  },
  result: {
    data: {
      notificationsGetConfigurations: [notificationConfigFactory.build()]
    },
  },
};

const notificationsGetConfigurationsErrorMock = {
  request: {
    query: gql(queries.notificationsGetConfigurations)
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const notificationByEmailMock = {
  request: {
    query: gql(mutations.usersConfigGetNotificationByEmail),
    variables: { byEmail: { isAllowed: false } }
  },
  result: {
    data: {
      configGetNotificationByEmailMutation: {
        byEmail: { isAllowed: false }
      }
    }
  },
};

const notificationByEmailErrorMock = {
  request: {
    query: gql(mutations.usersConfigGetNotificationByEmail),
    variables: { byEmail: { isAllowed: false } }
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const notificationsSaveConfigMock = {
  request: {
    query: gql(mutations.notificationsSaveConfig),
    variables: {
      notify: {
        notifType: '', isAllowed: false
      }
    }
  },
  result: {
    data: {
      configGetNotificationByEmailMutation: {
        notify: { isAllowed: false }
      }
    }
  },
};

const notificationsSaveConfigErrorMock = {
  request: {
    query: gql(mutations.notificationsSaveConfig),
    variables: {
      notify: {
        notifType: '', isAllowed: false
      }
    }
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

describe('NotificationSettings', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <NotificationSettings />
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
        mocks={[notificationsModulesQueryErrorMock, notificationsGetConfigurationsErrorMock, notificationByEmailErrorMock,
          notificationsSaveConfigErrorMock]}
        addTypename={false}
      >
        <NotificationSettings />
      </MockedProvider>
    );

    await wait(0);

    const tree = testRenderer.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[notificationsModulesQueryMock, notificationsGetConfigurationsMock, notificationByEmailMock,
          notificationsSaveConfigMock]}
        addTypename={false}
      >
        <NotificationSettings />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
