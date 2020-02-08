import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { userFactory } from 'modules/testing-utils/factories/user';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import MessengerPreview from '../MessengerPreview';

const fromUserId = 'string';
const sentAs = 'string';
const content = 'string';

const userMock = {
  request: {
    query: gql(queries.userDetail),
    variables: { _id: '' }
  },
  result: {
    data: {
      user: [
        userFactory.build(),
        userFactory.build({
          _id: '1'
        })
      ]
    }
  }
};

const userErrorMock = {
  request: {
    query: gql(queries.userDetail),
    variables: { _id: '' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('MessengerPreview', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <MessengerPreview fromUserId={fromUserId} sentAs={sentAs} content={content} />
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
        mocks={[userErrorMock]}
        addTypename={false}
      >
        <MessengerPreview fromUserId={fromUserId} sentAs={sentAs} content={content} />
      </MockedProvider>
    );

    const testInstance = testRenderer.root;
    const span = testInstance.findByType('span');
    expect(span.children).toContain('forced error');
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[userMock]}
        addTypename={false}
      >
        <MessengerPreview fromUserId={fromUserId} sentAs={sentAs} content={content} />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
