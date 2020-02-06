import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { actionsFactory, moduleFactory, permissionDocumentFactory, userGroupFactory } from 'modules/testing-utils/factories/settings/permissions';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';
import PermissionList from '../PermissionList';

const variables = {
  module: 'module',
  action: 'action',
  userId: '1',
  groupId: '2',
  allowed: false
}

const totalCountQueryMock = {
  request: {
    query: gql(queries.totalCount),
    variables
  },
  result: {
    data: {
      permissionsTotalCount: 0
    }
  }
};

const permissionsQueryMock = {
  request: {
    query: gql(queries.permissions),
    variables
  },
  result: {
    data: {
      permissions: [permissionDocumentFactory.build()]
    }
  }
};

const modulesQueryMock = {
  request: {
    query: gql(queries.modules)
  },
  result: {
    data: {
      permissionModules: [moduleFactory.build()]
    }
  }
};

const actionsQueryMock = {
  request: {
    query: gql(queries.actions)
  },
  result: {
    data: {
      permissionActions: [actionsFactory.build()]
    }
  }
};

const usersGroupsQueryMock = {
  request: {
    query: gql(queries.usersGroups)
  },
  result: {
    data: {
      usersGroups: [userGroupFactory.build()]
    }
  }
};

const permissionRemoveMutationMock = {
  request: {
    query: gql(mutations.permissionRemove)
  },
  result: {
    data: {
      ids: ['']
    }
  }
};

const totalCountQueryErrorMock = {
  request: {
    query: gql(queries.totalCount),
    variables
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const permissionsQueryErrorMock = {
  request: {
    query: gql(queries.permissions),
    variables
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const modulesQueryErrorMock = {
  request: {
    query: gql(queries.modules)
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const actionsQueryErrorMock = {
  request: {
    query: gql(queries.actions)
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const usersGroupsQueryErrorMock = {
  request: {
    query: gql(queries.usersGroups)
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const permissionRemoveErrorMock = {
  request: {
    query: gql(mutations.permissionRemove)
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('PermissionList', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <PermissionList />
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
        mocks={[totalCountQueryErrorMock, permissionsQueryErrorMock, modulesQueryErrorMock, actionsQueryErrorMock, usersGroupsQueryErrorMock, permissionRemoveErrorMock]}
        addTypename={false}
      >
        <PermissionList />
      </MockedProvider>
    );

    await wait(0);

    const tree = testRenderer.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[permissionRemoveMutationMock, usersGroupsQueryMock, actionsQueryMock, modulesQueryMock, permissionsQueryMock, totalCountQueryMock]}
        addTypename={false}
      >
        <PermissionList />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
