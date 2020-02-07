import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { propertiesFactory } from 'modules/testing-utils/factories/settings/properties';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import PropertyFormContainer from '../PropertyForm';

const queryParams = { type: '' };

const fieldsGroupsErrorMock = {
  request: {
    query: gql(queries.fieldsGroups),
    variables: { contentType: '' }
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const fieldsGroupsQueryMock = {
  request: {
    query: gql(queries.fieldsGroups),
    variables: { contentType: '' }
  },
  result: {
    data: {
      fieldsGroups: [
        propertiesFactory.build(),
        propertiesFactory.build({
          _id: 'id',
          contentType: 'type'
        })
      ]
    },
  },
};

describe('Properties', () => {
  it('should render loading state initially', () => {
    const component = create(
      <MockedProvider mocks={[]}>
        <PropertyFormContainer queryParams={queryParams} />
      </MockedProvider>
    );

    const tree = component.toJSON();
    expect(tree.children).toContain('Loading...');
  });

  it('error', async () => {
    const component = create(
      <MockedProvider
        mocks={[fieldsGroupsErrorMock]}
        addTypename={false}
      >
        <PropertyFormContainer queryParams={queryParams} />
      </MockedProvider>
    );

    await wait(0);

    const tree = component.toJSON();
    expect(tree.children).toContain('forced error')
  });

  it('should render content', async () => {
    const component = create(
      <MockedProvider
        mocks={[fieldsGroupsQueryMock]}
        addTypename={false}
      >
        <PropertyFormContainer queryParams={queryParams} />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = component.toJSON();
    expect(tree).toBe(null);
  });
});
