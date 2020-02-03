import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { queries as channelQueries } from 'modules/settings/channels/graphql';
import { queries as generalQueries } from 'modules/settings/general/graphql';
import { queries as usersGroupsQueries } from 'modules/settings/permissions/graphql';
import { channelFactory } from 'modules/testing-utils/factories/settings/channel';
import { userGroupFactory } from 'modules/testing-utils/factories/settings/permissions';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import UserFormContainer from '../UserForm';

const getEnvQueryMock = {
  request: {
    query: gql(generalQueries.configsGetEnv)
  },
  result: {
    data: {},
  },
};

const channelsQueryMock = {
  request: {
    query: gql(channelQueries.channels)
  },
  result: {
    data: {
      channels: [
        channelFactory.build(),
        channelFactory.build({
          _id: '1',
          name: 'channel'
        })
      ]
    },
  },
};

const usersGroupsQueryMock = {
  request: {
    query: gql(usersGroupsQueries.usersGroups)
  },
  result: {
    data: {
      usersGroups: [
        userGroupFactory.build(),
        userGroupFactory.build({
          _id: '1',
          name: 'usergroup'
        })
      ]
    },
  },
};

const getEnvQueryErrorMock = {
  request: {
    query: gql(generalQueries.configsGetEnv)
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const channelsQueryErrorMock = {
  request: {
    query: gql(channelQueries.channels)
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const usersGroupsQueryErrorMock = {
  request: {
    query: gql(usersGroupsQueries.usersGroups)
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

describe('UserForm', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <UserFormContainer />
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
        mocks={[getEnvQueryErrorMock, channelsQueryErrorMock, usersGroupsQueryErrorMock]}
        addTypename={false}
      >
        <UserFormContainer />
      </MockedProvider>
    );

    await wait(0);

    const tree = testRenderer.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[getEnvQueryMock, channelsQueryMock, usersGroupsQueryMock]}
        addTypename={false}
      >
        <UserFormContainer />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
