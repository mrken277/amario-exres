import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import * as React from 'react';
import { act, create } from 'react-test-renderer';
import wait from 'waait';
import { mutations } from '../../graphql';
import ItemContainer from '../Item';

const item = {
  _id: '1',
  checklistId: 'string',
  isChecked: true,
  content: 'string',
};

const convertToCard = {
  name: 'string',
  callback: () => 'void',
};

const checklistItemsEditMock = {
  request: {
    query: gql(mutations.checklistItemsEdit),
    variables: { _id: '' }
  },
  result: {
    data: { _id: '' }
  }
};

const checklistItemsRemoveMock = {
  request: {
    query: gql(mutations.checklistItemsRemove),
    variables: { _id: '' }
  },
  result: {
    data: { _id: '' }
  }
};

const checklistItemsEditErrorMock = {
  request: {
    query: gql(mutations.checklistItemsEdit),
    variables: { _id: '' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const checklistItemsRemoveErrorMock = {
  request: {
    query: gql(mutations.checklistItemsRemove),
    variables: { _id: '' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('Checklist item', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <ItemContainer item={item} convertToCard={convertToCard} />
      </MockedProvider>
    );

    const testInstance = testRenderer.root;
    const loader = testInstance.findByProps({ objective: true }).type;

    const spinner = loader({});

    expect(spinner.props.objective).toEqual(false);
  });

  it('should show error checklist', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[checklistItemsEditErrorMock, checklistItemsRemoveErrorMock]}
        addTypename={false}
      >
        <ItemContainer item={item} convertToCard={convertToCard} />
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
        mocks={[checklistItemsEditMock, checklistItemsRemoveMock]}
        addTypename={false}
      >
        <ItemContainer item={item} convertToCard={convertToCard} />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
