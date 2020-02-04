import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import * as React from 'react';
import { act, create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';
import ListContainer from '../List';

const listId = '1';
const stageId = '';
// const addItem = {
//   doc: '',
//   callback: () => '',
// };

const checklistsRemoveEditMock = {
  request: {
    query: gql(mutations.checklistsRemove),
    variables: { _id: '' }
  },
  result: {
    data: { _id: '' }
  }
};

const checklistItemsAddMock = {
  request: {
    query: gql(mutations.checklistItemsAdd),
    variables: { _id: '' }
  },
  result: {
    data: {
      checklistItemsAdd: [{
        _id: '',
        isChecked: true,
        content: ''
      }]

    }
  }
};

const checklistDetailMock = {
  request: {
    query: gql(queries.checklistDetail),
    variables: {}
  },
  result: {
    data: {
      checklistDetail: [{
        _id: ''
      }
      ]
    }
  }
};

const checklistsRemoveErrorMock = {
  request: {
    query: gql(mutations.checklistsRemove),
    variables: { _id: '' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const checklistItemsAddErrorMock = {
  request: {
    query: gql(mutations.checklistItemsAdd),
    variables: { _id: '' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('Checklists - list', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <ListContainer listId={listId} stageId={stageId} />
      </MockedProvider>
    );

    const testInstance = testRenderer.root;
    const loader = testInstance.findByProps({ objective: true }).type;

    const spinner = loader({});

    expect(spinner.props.objective).toEqual(false);
  });

  it('should show error checklist - list', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[checklistsRemoveErrorMock, checklistItemsAddErrorMock, checklistDetailMock]}
        addTypename={false}
      >
        <ListContainer listId={listId} stageId={stageId} />
      </MockedProvider>
    );

    await act(async () => {
      await wait(0);
    });

    const testInstance = testRenderer.root;
    const span = testInstance.findByType('span');
    expect(span.children).toContain('forced error');
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[checklistsRemoveEditMock, checklistItemsAddMock, checklistDetailMock]}
        addTypename={false}
      >
        <ListContainer listId={listId} stageId={stageId} />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
