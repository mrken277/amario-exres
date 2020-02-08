import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { engageMessageFactory } from 'modules/testing-utils/factories/engage';
import { brandFactory } from 'modules/testing-utils/factories/settings/brands';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import MessageForm from '../MessageForm';

const kind = 'string';
const messageId = 'string';

const EngageMessageDetailMock = {
  request: {
    query: gql(queries.engageMessageDetail),
    variables: { _id: 'string' }
  },
  result: {
    data: {
      EngageMessageDetail: [
        engageMessageFactory.build(),
        engageMessageFactory.build({
          _id: '3'
        })
      ]
    }
  }
};

const brandsMock = {
  request: {
    query: gql(queries.brands),
    variables: {}
  },
  result: {
    data: {
      brands: [
        brandFactory.build(),
        brandFactory.build({
          _id: '3'
        })
      ]
    }
  }
};

const EngageMessageDetailErrorMock = {
  request: {
    query: gql(queries.engageMessageDetail),
    variables: { _id: 'string' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('MessageForm', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <MessageForm kind={kind} messageId={messageId} />
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
        mocks={[EngageMessageDetailErrorMock, brandsMock]}
        addTypename={false}
      >
        <MessageForm kind={kind} messageId={messageId} />
      </MockedProvider>
    );

    const testInstance = testRenderer.root;
    const span = testInstance.findByType('span');
    expect(span.children).toContain('forced error');
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[EngageMessageDetailMock, brandsMock]}
        addTypename={false}
      >
        <MessageForm kind={kind} messageId={messageId} />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
