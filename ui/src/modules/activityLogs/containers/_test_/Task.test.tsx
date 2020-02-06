import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { mutations, queries } from 'modules/tasks/graphql';
import { itemFactory } from 'modules/testing-utils/factories/boards/item';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import Task from '../items/boardItems/Task';


const taskId = '';

const taskDetailsMock = {
  request: {
    query: gql(queries.taskDetail),
    variables: { _id: '' },
  },
  result: {
    data: {
      taskDetailsDetail: [
        itemFactory.build(),
        itemFactory.build({
          _id: 'id'
        })
      ]
    },
  },
};

const editMutationMock = {
  request: {
    query: gql(mutations.tasksEdit),
    variables: { _id: '' },
  },
  result: {
    data: {},
  },
};

const removeMutationMock = {
  request: {
    query: gql(mutations.tasksRemove),
    variables: { _id: '' },
  },
  result: {
    data: {},
  },
};

const removeMutationErrorMock = {
  request: {
    query: gql(mutations.tasksRemove),
    variables: { _id: '' },
  },
  result: {
    errors: [new GraphQLError('errorEngageMessage!')],
  }
};

const editMutationErrorMock = {
  request: {
    query: gql(mutations.tasksEdit),
    variables: { _id: '' },
  },
  result: {
    errors: [new GraphQLError('errorEngageMessage!')],
  }
};

const taskDetailsErrorMock = {
  request: {
    query: gql(queries.taskDetail),
    variables: { _id: '' },
  },
  result: {
    errors: [new GraphQLError('errorEngageMessage!')],
  }
};

describe('Tasks', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <Task
          taskId={taskId}
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
      <MockedProvider mocks={[editMutationErrorMock, taskDetailsErrorMock, removeMutationErrorMock]} addTypename={false}>
        <Task
          taskId={taskId}
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
      <MockedProvider mocks={[taskDetailsMock, editMutationMock, removeMutationMock]} addTypename={false}>
        <Task
          taskId={taskId}
        />
      </MockedProvider>
    );
    await wait(0);

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});


