import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { channelFactory } from 'modules/testing-utils/factories/settings/channel';
import { withRouter } from 'modules/testing-utils/withRouter';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import Channels from '../Channels';

const channelDetailQueryMock = {
  request: {
    query: gql(queries.channelDetail),
    variables: { _id: '1' }
  },
  result: {
    data: {
      channelDetail: channelFactory.build()
    }
  }
};

const integrationsCountQueryMock = {
  request: {
    query: gql(queries.integrationsCount),
    variables: { channelId: '1' }
  },
  result: {
    data: {
      integrationsTotalCount: {
        total: 0,
        byKind: {
          messenger: 0
        }
      }
    }
  }
};

const channelDetailErrorMock = {
  request: {
    query: gql(queries.channelDetail),
    variables: { _id: '1' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const integrationsCountErrorMock = {
  request: {
    query: gql(queries.integrationsCount),
    variables: { channelId: '1' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('Channels', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <Channels />
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
        mocks={[channelDetailErrorMock, integrationsCountErrorMock]}
        addTypename={false}
      >
        {withRouter(
          <Channels />
        )}
      </MockedProvider>
    );

    await wait(0);

    const tree = testRenderer.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[integrationsCountQueryMock, channelDetailQueryMock]}
        addTypename={false}
      >
        {withRouter(
          <Channels />
        )}
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
