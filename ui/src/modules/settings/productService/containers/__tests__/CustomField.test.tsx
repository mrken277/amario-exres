import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { queries as fieldQueries } from 'modules/settings/properties/graphql';
import { propertiesFactory } from 'modules/testing-utils/factories/settings/properties';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations } from '../../graphql';
import CustomField from '../product/detail/CustomFieldsSection';

const fieldsGroupsQueryMock = {
  request: {
    query: gql(fieldQueries.fieldsGroups),
    variables: { contentType: '1' }
  },
  result: {
    data: {
      fieldsGroups: [propertiesFactory.build()]
    },
  },
};

const productsQueryErrorMock = {
  request: {
    query: gql(fieldQueries.fieldsGroups),
    variables: { contentType: '1' }
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const productEditMutationMock = {
  request: {
    query: gql(mutations.productEdit),
    variables: { _id: '1' },
  },
  result: {
    data: { _id: '1' }
  },
};

const productEditMutationErrorMock = {
  request: {
    query: gql(mutations.productEdit)
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

describe('CustomField', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <CustomField />
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
        mocks={[productsQueryErrorMock, productEditMutationErrorMock]}
        addTypename={false}
      >
        <CustomField />
      </MockedProvider>
    );

    await wait(0);

    const tree = testRenderer.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[fieldsGroupsQueryMock, productEditMutationMock]}
        addTypename={false}
      >
        <CustomField />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
