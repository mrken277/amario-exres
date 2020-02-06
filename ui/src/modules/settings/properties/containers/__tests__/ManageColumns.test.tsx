import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { createMemoryHistory } from 'history';
import { queries } from 'modules/forms/graphql';
import { combinedFieldsFactory, configColumnFactory } from 'modules/testing-utils/factories/settings/properties';
import { withRouter } from 'modules/testing-utils/withRouter';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import ManageColumns from '../ManageColumns';

const fieldsQueryMock = {
  request: {
    query: gql(queries.fieldsCombinedByContentType),
    variables: { contentType: '' }
  },
  result: {
    data: {
      fieldsCombinedByContentType: [combinedFieldsFactory.build()]
    },
  },
};

const fieldsDefaultColumnsConfigQueryMock = {
  request: {
    query: gql(queries.fieldsDefaultColumnsConfig),
    variables: { contentType: '' }
  },
  result: {
    data: {
      fieldsDefaultColumnsConfig: [configColumnFactory.build()]
    },
  },
};

const fieldsQueryErrorMock = {
  request: {
    query: gql(queries.fieldsCombinedByContentType),
    variables: { contentType: '' }
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const fieldsDefaultColumnsConfigQueryErrorMock = {
  request: {
    query: gql(queries.fieldsDefaultColumnsConfig),
    variables: { contentType: '' }
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const route = '/settings/properties/';
const history = createMemoryHistory({
  initialEntries: [route]
});

describe('ManageColumns', () => {
  it('should render loading state initially', () => {
    const component = create(
      <MockedProvider mocks={[]}>
        {withRouter(<ManageColumns history={history} />)}
      </MockedProvider>
    );

    const tree = component.toJSON();
    expect(tree.children).toContain('Loading...');
  });

  it('error', async () => {
    const component = create(
      <MockedProvider
        mocks={[fieldsQueryErrorMock, fieldsDefaultColumnsConfigQueryErrorMock]}
        addTypename={false}
      >
        {withRouter(<ManageColumns history={history} />)}
      </MockedProvider>
    );

    await wait(0);

    const tree = component.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const component = create(
      <MockedProvider
        mocks={[fieldsQueryMock, fieldsDefaultColumnsConfigQueryMock]}
        addTypename={false}
      >
        {withRouter(<ManageColumns history={history} />)}
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = component.toJSON();
    expect(tree).toBe(null);
  });
});
