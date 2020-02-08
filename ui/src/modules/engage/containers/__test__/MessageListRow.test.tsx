import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations } from '../../graphql';
import MessageListRow from '../MessageListRow';

const removeMutationMock = {
  request: {
    query: gql(mutations.messageRemove),
    variables: { _id: '' }
  },
  result: {
    data: {
      _id: 'string'
    }
  }
};

const removeMutationErrorMock = {
  request: {
    query: gql(mutations.messageRemove),
    variables: { _id: '' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const setPauseMutationMock = {
  request: {
    query: gql(mutations.setPause),
    variables: { _id: '' }
  },
  result: {
    data: {
      _id: ''
    }
  }
};

const setLiveMutationMock = {
  request: {
    query: gql(mutations.setPause),
    variables: { _id: '' }
  },
  result: {
    data: {
      _id: ''
    }
  }
};


const setLiveManualMutationMock = {
  request: {
    query: gql(mutations.setPause),
    variables: { _id: '' }
  },
  result: {
    data: {
      _id: ''
    }
  }
};

describe('MessageListRow', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <MessageListRow />
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
        mocks={[removeMutationErrorMock, setPauseMutationMock, setLiveMutationMock, setLiveManualMutationMock]}
        addTypename={false}
      >
        <MessageListRow />
      </MockedProvider>
    );

    const testInstance = testRenderer.root;
    const span = testInstance.findByType('span');
    expect(span.children).toContain('forced error');
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[removeMutationMock, setPauseMutationMock, setLiveMutationMock, setLiveManualMutationMock]}
        addTypename={false}
      >
        <MessageListRow />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
