import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations } from '../../graphql';
import UserConfirmationContainer from '../UserConfirmation';

const variables = {
  token: '',
  password: '',
  passwordConfirmation: '',
  fullName: '',
  username: ''
}

const usersConfirmInvitationMocks = {
  request: {
    query: gql(mutations.usersConfirmInvitation),
    variables
  },
  result: {
    data: { token: '' }
  },
};

const usersConfirmInvitationErrorMock = {
  request: {
    query: gql(mutations.usersConfirmInvitation),
    variables
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

describe('UserForm', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <UserConfirmationContainer queryParams={''} />
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
        mocks={[usersConfirmInvitationErrorMock]}
        addTypename={false}
      >
        <UserConfirmationContainer queryParams={''} />
      </MockedProvider>
    );

    await wait(0);

    const tree = testRenderer.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[usersConfirmInvitationMocks]}
        addTypename={false}
      >
        <UserConfirmationContainer queryParams={''} />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
