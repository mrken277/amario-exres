import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations } from '../../graphql';
import ChangePassword from '../ChangePassword';

const usersChangePasswordMutationMock = {
  request: {
    query: gql(mutations.usersChangePassword)
  },
  result: {
    data: {}
  },
};

const usersChangePasswordMutationErrorMock = {
  request: {
    query: gql(mutations.usersChangePassword)
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

describe('ChangePassword', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <ChangePassword />
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
        mocks={[usersChangePasswordMutationErrorMock]}
        addTypename={false}
      >
        <ChangePassword />
      </MockedProvider>
    );

    await wait(0);

    const tree = testRenderer.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[usersChangePasswordMutationMock]}
        addTypename={false}
      >
        <ChangePassword />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
