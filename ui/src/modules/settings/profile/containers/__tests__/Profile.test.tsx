import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { mutations } from 'modules/settings/team/graphql';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import Profile from '../Profile';

const usersEditProfileMock = {
  request: {
    query: gql(mutations.usersEditProfile),
    variables: { _id: '' },
  },
  result: {
    data: { _id: '' }
  },
};

const usersEditProfileErrorMock = {
  request: {
    query: gql(mutations.usersEditProfile)
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

describe('Profile', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <Profile queryParams={''} />
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
        mocks={[usersEditProfileErrorMock]}
        addTypename={false}
      >
        <Profile queryParams={''} />
      </MockedProvider>
    );

    await wait(0);

    const tree = testRenderer.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[usersEditProfileMock]}
        addTypename={false}
      >
        <Profile queryParams={''} />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
