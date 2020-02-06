import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { createMemoryHistory } from 'history';
import { productCategoryFactory } from 'modules/testing-utils/factories/settings/productService';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';
import CategoryList from '../productCategory/CategoryList';

const productCategoriesQueryMock = {
  request: {
    query: gql(queries.productCategories),
    variables: { parentId: '1' }
  },
  result: {
    data: {
      productCategories: productCategoryFactory.build()
    },
  },
};

const productCategoriesErrorMock = {
  request: {
    query: gql(queries.productCategories),
    variables: { parentId: '1' }
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const productCategoriesCountMock = {
  request: {
    query: gql(queries.productCategoriesCount)
  },
  result: {
    data: {
      productCategoriesTotalCount: 0
    },
  },
};

const productCategoriesCountErrorMock = {
  request: {
    query: gql(queries.productCategoriesCount)
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const productCategoryRemoveMock = {
  request: {
    query: gql(mutations.productCategoryRemove),
    variables: { _id: '1' },
  },
  result: {
    data: { _id: '1' }
  },
};

const productCategoryRemoveErrorMock = {
  request: {
    query: gql(mutations.productCategoryRemove),
    variables: { _id: '1' }
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const route = '/settings/product-service';
const history = createMemoryHistory({
  initialEntries: [route]
});

describe('CategoryList', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <CategoryList history={history} queryParams={''} />
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
        mocks={[productCategoriesErrorMock, productCategoriesCountErrorMock, productCategoryRemoveMock]}
        addTypename={false}
      >
        <CategoryList history={history} queryParams={''} />
      </MockedProvider>
    );

    await wait(0);

    const tree = testRenderer.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[productCategoriesQueryMock, productCategoriesCountMock, productCategoryRemoveErrorMock]}
        addTypename={false}
      >
        <CategoryList history={history} queryParams={''} />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
