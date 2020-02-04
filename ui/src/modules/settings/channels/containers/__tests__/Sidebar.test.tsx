import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { channelFactory } from 'modules/testing-utils/factories/settings/channel';
import { withRouter } from 'modules/testing-utils/withRouter';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';
import Sidebar from '../Sidebar';

const channelsQueryMock = {
  request: {
    query: gql(queries.channels),
    variables: { perPage: 10 }
  },
  result: {
    data: {
      channels: [
        channelFactory.build(),
        channelFactory.build({
          _id: '1'
        })
      ]
    }
  }
};

const channelsCountQueryMock = {
  request: {
    query: gql(queries.channelsCount)
  },
  result: {
    data: {
      channelsTotalCount: 0
    }
  }
};

const channelRemoveMutationMock = {
  request: {
    query: gql(mutations.channelRemove),
    variables: { _id: '1' }
  },
  result: {
    data: {}
  }
};

const channelsQueryErrorMock = {
  request: {
    query: gql(queries.channels),
    variables: { perPage: 10 }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const channelsCountQueryErrorMock = {
  request: {
    query: gql(queries.channelsCount)
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const channelRemoveMutationErrorMock = {
  request: {
    query: gql(mutations.channelRemove)
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('Sidebar', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <Sidebar queryParams={''} />
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
        mocks={[channelsQueryErrorMock, channelsCountQueryErrorMock, channelRemoveMutationErrorMock]}
        addTypename={false}
      >
        {withRouter(
          <Sidebar queryParams={''} />
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
        mocks={[channelsQueryMock, channelsCountQueryMock, channelRemoveMutationMock]}
        addTypename={false}
      >
        {withRouter(
          <Sidebar queryParams={''} />
        )}
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
