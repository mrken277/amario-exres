import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { leadIntegrationFactory } from 'modules/testing-utils/factories/leads';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';
import EditLead from '../EditLead';

const contentTypeId = 'string';
const formId = 'string';
const queryParams = 'any';

const EditIntegrationMutationVariables = {
  _id: 'string',
  leadData: {},
  brandId: 'string',
  name: 'string',
  languageCode: 'string',
  formId: 'string',
};

const LeadIntegrationDetailMock = {
  request: {
    query: gql(queries.integrationDetail),
    variables: { _id: 'string' }
  },
  result: {
    data: {
      LeadIntegrationDetail: [
        leadIntegrationFactory.build(),
        leadIntegrationFactory.build({
          _id: '3'
        })
      ]
    }
  }
};

const LeadIntegrationDetailErrorMock = {
  request: {
    query: gql(queries.integrationDetail),
    variables: { _id: 'string' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const editIntegrationMutationMock = {
  request: {
    query: gql(mutations.integrationsEditLeadIntegration),
    variables: EditIntegrationMutationVariables
  },
  result: {
    data: {}
  }
};

const editIntegrationMutationErrorMock = {
  request: {
    query: gql(mutations.integrationsEditLeadIntegration),
    variables: EditIntegrationMutationVariables
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('EditLead of Leads', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <EditLead contentTypeId={contentTypeId} formId={formId} queryParams={queryParams} />
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
        mocks={[LeadIntegrationDetailErrorMock, editIntegrationMutationErrorMock]}
        addTypename={false}
      >
        <EditLead contentTypeId={contentTypeId} formId={formId} queryParams={queryParams} />
      </MockedProvider>
    );

    await wait(0);

    const testInstance = testRenderer.root;
    const span = testInstance.findByType('span');
    expect(span.children).toContain('forced error');
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[editIntegrationMutationMock, LeadIntegrationDetailMock]}
        addTypename={false}
      >
        <EditLead contentTypeId={contentTypeId} formId={formId} queryParams={queryParams} />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
