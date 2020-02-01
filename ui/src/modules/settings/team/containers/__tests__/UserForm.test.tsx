import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { queries as generalQueries } from 'modules/settings/general/graphql';
import { channelFactory } from 'modules/testing-utils/factories/settings/channel';
import { userGroupFactory } from 'modules/testing-utils/factories/settings/permissions';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries as channelQueries } from '../../channels/graphql';
import { queries as usersGroupsQueries } from '../../permissions/
import UserFormContainer from '../UserForm';

const configVariables = { code: '' };

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

const configErrorMock = {
  request: {
    query: gql(queries.configsDetail),
    variables: configVariables,
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const insertConfigMutationMocks = {
  request: {
    query: gql(mutations.insertConfig),
    variables: { code: '', value: [''] },
  },
  result: {
    data: {
      code: '', value: ['']
    }
  },
};

describe('Account default', () => {
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
        mocks={[configErrorMock]}
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
        mocks={[configQueryMock, insertConfigMutationMocks]}
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
