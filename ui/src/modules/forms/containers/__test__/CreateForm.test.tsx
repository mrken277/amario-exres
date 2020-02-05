import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import * as React from 'react';
import { act, create } from 'react-test-renderer';
import wait from 'waait';
import { mutations } from '../../graphql';
import CreateForm from '../CreateForm'

// const type = 'string';
// const isReadyToSave = true;

const addFormVariables = {
  title: 'string',
  description: 'string',
  buttonText: 'string',
  type: 'string',
};

const fieldsAddVariables = {
  contentType: 'string',
  contentTypeId: 'string',
  field: { _id: '' }
};

const addFormMock = {
  request: {
    query: gql(mutations.addForm),
    variables: addFormVariables
  },
  result: {
    data: {}
  }
};

const fieldsAddMock = {
  request: {
    query: gql(mutations.fieldsAdd),
    variables: fieldsAddVariables
  },
  result: {
    data: {}
  }
};

const fieldsAddErrorMock = {
  request: {
    query: gql(mutations.fieldsAdd),
    variables: fieldsAddVariables
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const addFormErrorMock = {
  request: {
    query: gql(mutations.addForm),
    variables: addFormVariables
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('popUps test', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <CreateForm />
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
        mocks={[fieldsAddErrorMock, addFormErrorMock]}
        addTypename={false}
      >
        <CreateForm />
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
        mocks={[addFormMock, fieldsAddMock]}
        addTypename={false}
      >
        <CreateForm />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});