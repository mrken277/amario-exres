import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
// import { createMemoryHistory } from 'history';
import { withRouter } from 'modules/testing-utils/withRouter';
import * as React from 'react';
import { act, create } from 'react-test-renderer';
import wait from 'waait';
import { mutations } from '../../graphql';
import CreateLead from '../CreateLead';

const AddIntegrationMutationVariables = {
  leadData: {},
  brandId: 'string',
  name: 'string',
  languageCode: 'string',
  formId: 'string',
};

const addIntegrationMock = {
  request: {
    query: gql(mutations.integrationsCreateLeadIntegration),
    variables: AddIntegrationMutationVariables
  },
  result: {
    data: {}
  }
};

const addIntegrationErrorMock = {
  request: {
    query: gql(mutations.integrationsCreateLeadIntegration),
    variables: AddIntegrationMutationVariables
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

// const route = '/leads';
// const history = createMemoryHistory({
//   initialEntries: [route]
// });

describe('CreateLead of Leads', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <CreateLead />
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
        mocks={[addIntegrationErrorMock]}
        addTypename={false}
      >
        {withRouter(
          <CreateLead />
        )}
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
        mocks={[addIntegrationMock]}
        addTypename={false}
      >
        {withRouter(
          <CreateLead />
        )}
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
