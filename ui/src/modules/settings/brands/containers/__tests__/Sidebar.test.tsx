import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { brandFactory } from 'modules/testing-utils/factories/settings/brands';
import { withRouter } from 'modules/testing-utils/withRouter';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';
import Sidebar from '../Sidebar';

const brandsQueryMock = {
  request: {
    query: gql(queries.brands),
    variables: { perPage: 20 }
  },
  result: {
    data: {
      brands: [
        brandFactory.build(),
        brandFactory.build({
          _id: '1'
        })
      ]
    }
  }
};

const brandsCountQueryMock = {
  request: {
    query: gql(queries.brandsCount)
  },
  result: {
    data: {
      brandsTotalCount: 0
    }
  }
};

const brandRemoveMutationMock = {
  request: {
    query: gql(mutations.brandRemove),
    variables: { _id: '1' }
  },
  result: { data: {} }
};

const brandsQueryErrorMock = {
  request: {
    query: gql(queries.brands),
    variables: { perPage: 20 }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const brandsCountQueryErrorMock = {
  request: {
    query: gql(queries.brandsCount)
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const channelRemoveMutationErrorMock = {
  request: {
    query: gql(mutations.brandRemove)
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('Sidebar', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <Sidebar queryParams={''} />
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
        mocks={[brandsQueryErrorMock, brandsCountQueryErrorMock, channelRemoveMutationErrorMock]}
        addTypename={false}
      >
        {withRouter(
          <Sidebar queryParams={''} />
        )}
      </MockedProvider>
    );

    await wait(0);

    const tree = testRenderer.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[brandsQueryMock, brandsCountQueryMock, brandRemoveMutationMock]}
        addTypename={false}
      >
        {withRouter(
          <Sidebar queryParams={''} />
        )}
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
