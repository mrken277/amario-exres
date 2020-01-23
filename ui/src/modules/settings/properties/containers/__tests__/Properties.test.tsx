import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { propertiesFactory } from 'modules/testing-utils/factories/settings/properties';
import { withRouter } from 'modules/testing-utils/withRouter';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';
import PropertiesContainer from '../Properties';

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

const fieldsGroupsRemoveMutationMocks = {
  request: {
    query: gql(mutations.fieldsGroupsRemove),
    variables: { _id: '' },
  },
  result: {
    data: { _id: '' }
  },
};

const fieldsRemoveMutationMocks = {
  request: {
    query: gql(mutations.fieldsRemove),
    variables: { _id: '' },
  },
  result: {
    data: { _id: '' }
  },
};

const fieldsGroupsUpdateVisibleMutationMocks = {
  request: {
    query: gql(mutations.fieldsGroupsUpdateVisible),
    variables: { _id: '', isVisible: false },
  },
  result: {
    data: { _id: '' }
  },
};

const fieldsUpdateVisibleMutationMocks = {
  request: {
    query: gql(mutations.fieldsUpdateVisible),
    variables: { _id: '', isVisible: false },
  },
  result: {
    data: { _id: '' }
  },
};

describe('Properties', () => {
  it('should render loading state initially', () => {
    const component = create(
      <MockedProvider mocks={[]}>
        {withRouter(<PropertiesContainer queryParams={queryParams} history={history} />)}
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
        {withRouter(<PropertiesContainer queryParams={queryParams} history={history} />)}
      </MockedProvider>
    );

    await wait(0);

    const tree = component.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const component = create(
      <MockedProvider
        mocks={[fieldsGroupsQueryMock, fieldsGroupsRemoveMutationMocks, fieldsRemoveMutationMocks, fieldsGroupsUpdateVisibleMutationMocks, fieldsUpdateVisibleMutationMocks]}
        addTypename={false}
      >
        {withRouter(<PropertiesContainer queryParams={queryParams} history={history} />)}
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = component.toJSON();
    expect(tree).toBe(null);
  });
});
