import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { formFactory } from 'modules/testing-utils/factories/froms';
import { fieldFactory } from 'modules/testing-utils/factories/settings/properties';
import { userFactory } from 'modules/testing-utils/factories/user';
import * as React from 'react';
import { act, create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';
import EditForm from '../EditForm';

// const type = 'string';
// const isReadyToSave = true;
// const formId = 'string';
// const integration = { _id: 'string' };
// const showMessage = true;

const FieldsVariables = {
  contentType: 'form',
  contentTypeId: '1'
};

const createFieldVariables = {
  _id: 'string',
  key: 'string',
  contentType: 'string',
  contentTypeId: 'string',
  type: 'string',
  validation: 'string',
  text: 'string',
  description: 'string',
  options: [''],
  isRequired: false,
  order: {},
  isVisible: false,
  isDefinedByErxes: false,
  groupId: 'string',
  lastUpdatedUser: userFactory.build({ _id: '2' }),
  lastUpdatedUserId: 'string',
};

const EditFormMutationVariables = {
  _id: 'string',
  title: 'string',
  description: 'string',
  buttonText: 'string',
  type: 'string',
};

const FieldsMock = {
  request: {
    query: gql(queries.fields),
    variables: FieldsVariables
  },
  result: {
    data: {
      fieldsDetails: [
        fieldFactory.build(),
        fieldFactory.build({
          _id: 'string'
        })
      ]
    }
  }
};

const FieldsErrorMock = {
  request: {
    query: gql(queries.fields),
    variables: FieldsVariables
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const FormDetailMock = {
  request: {
    query: gql(queries.formDetail),
    variables: { _id: '' }
  },
  result: {
    data: {
      FormDetailDetails: [
        formFactory.build(),
        formFactory.build({
          _id: 'string'
        })
      ]
    }
  }
};

const FormDetailErrorMock = {
  request: {
    query: gql(queries.fields),
    variables: { _id: '' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};


const addFieldMock = {
  request: {
    query: gql(mutations.fieldsAdd),
    variables: { createFieldsData: createFieldVariables }
  },
  result: {
    data: {}
  }
};

const addFieldErrorMock = {
  request: {
    query: gql(mutations.fieldsAdd),
    variables: { createFieldsData: createFieldVariables }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const editFormMock = {
  request: {
    query: gql(mutations.editForm),
    variables: EditFormMutationVariables
  },
  result: {
    data: {}
  }
};

const editFormErrorMock = {
  request: {
    query: gql(mutations.editForm),
    variables: EditFormMutationVariables
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const editFieldMock = {
  request: {
    query: gql(mutations.fieldsEdit),
    variables: { updateFieldsData: createFieldVariables }
  },
  result: {
    data: {}
  }
};

const editFieldErrorMock = {
  request: {
    query: gql(mutations.fieldsEdit),
    variables: { updateFieldsData: createFieldVariables }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const removeFieldMock = {
  request: {
    query: gql(mutations.fieldsEdit),
    variables: { removeFieldsData: createFieldVariables }
  },
  result: {
    data: {}
  }
};

const removeFieldErrorMock = {
  request: {
    query: gql(mutations.fieldsEdit),
    variables: { removeFieldsData: createFieldVariables }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('popUps editform test', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <EditForm />
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
        mocks={[FieldsErrorMock, FormDetailErrorMock, addFieldErrorMock, editFormErrorMock, removeFieldErrorMock]}
        addTypename={false}
      >
        <EditForm />
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
        mocks={[FormDetailMock, FieldsMock, addFieldMock, editFormMock, editFieldMock, editFieldErrorMock, removeFieldMock]}
        addTypename={false}
      >
        <EditForm />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});