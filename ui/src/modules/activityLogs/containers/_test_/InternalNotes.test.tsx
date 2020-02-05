import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { queries } from 'modules/internalNotes/graphql';
import { internalNoteFactory } from 'modules/testing-utils/factories/internalNotes';
import { userDetailsFactory, userLinksFactory } from 'modules/testing-utils/factories/user';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import InternalNote from '../items/InternalNote';
const user = {
  _id: '12',
  brands: [],
  emailSignatures: [],
  // IUserDoc
  username: 'Bataa',
  email: 'bat@nmma.co',
  isActive: true,
  details: userDetailsFactory.build({ fullName: 'Bat Dorj' }),
  isOwner: true,
  status: 'ok',
  links: userLinksFactory.build({ facebook: 'facebook' }),
  getNotificationByEmail: true,
  participatedConversations: [],
  permissionActions: ['owner', 'visiter']
};

const activity = 'any';
const noteId = 'engage';
const currenUser = user;

const internalNoteDetailsMock = {
  request: {
    query: gql(queries.internalNoteDetail),
    variables: { _id: '' },
  },
  result: {
    data: {
      internalNoteDetailsDetail: [
        internalNoteFactory.build(),
        internalNoteFactory.build({
          _id: 'id'
        })
      ]
    },
  },
};

const internalNoteDetailsErrorMock = {
  request: {
    query: gql(queries.internalNoteDetail),
    variables: { _id: '' },
  },
  result: {
    errors: [new GraphQLError('errorEngageMessage!')],
  }
};

describe('InternalNotes', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <InternalNote
          activity={activity}
          noteId={noteId}
          currenUser={currenUser}
        />
      </MockedProvider>
    );

    const testInstance = testRenderer.root;
    const loader = testInstance.findByProps({ objective: true }).type;

    const spinner = loader({});

    expect(spinner.props.objective).toEqual(false);
  });

  it('should show error', async () => {
    const testRenderer = create(
      <MockedProvider mocks={[internalNoteDetailsErrorMock]} addTypename={false}>
        <InternalNote
          activity={activity}
          noteId={noteId}
          currenUser={currenUser}
        />
      </MockedProvider>
    );

    await wait(0);

    const testInstance = testRenderer.root;
    const span = testInstance.findByType('span');
    expect(span.children).toContain('forced error');
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider mocks={[internalNoteDetailsMock]} addTypename={false}>
        <InternalNote
          activity={activity}
          noteId={noteId}
          currenUser={currenUser}
        />
      </MockedProvider>
    );
    await wait(0);

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});


