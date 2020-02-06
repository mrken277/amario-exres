import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { productCategoryFactory, productFactory } from 'modules/testing-utils/factories/settings/productService';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';
import ProductList from '../product/ProductList';

const productsQueryMock = {
  request: {
    query: gql(queries.products),
    variables: {
      categoryId: '1',
      tag: 'lead'
    }
  },
  result: {
    data: {
      products: [productFactory.build()]
    },
  },
};

const productsQueryErrorMock = {
  request: {
    query: gql(queries.products),
    variables: { categoryId: '1', tag: 'lead' }
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const productCategoryDetailQueryMock = {
  request: {
    query: gql(queries.productCategoryDetail),
    variables: { _id: '1' }
  },
  result: {
    data: {
      productCategoryDetail: productCategoryFactory.build()
    },
  },
};

const productCategoryDetailErrorMock = {
  request: {
    query: gql(queries.productCategoryDetail),
    variables: { _id: '1' }
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const productsCountMock = {
  request: {
    query: gql(queries.productsCount)
  },
  result: {
    data: {
      productsTotalCount: 0
    },
  },
};

const productsCountErrorMock = {
  request: {
    query: gql(queries.productsCount)
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const productsRemoveMutationMock = {
  request: {
    query: gql(mutations.productsRemove),
    variables: { productIds: [''] },
  },
  result: {
    data: {
      productIds: ['']
    }
  },
};

const productsRemoveMutationErrorMock = {
  request: {
    query: gql(mutations.productsRemove)
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

describe('ProductList', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <ProductList history={history} queryParams={''} />
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
        mocks={[productsQueryErrorMock, productCategoryDetailErrorMock,
          productsCountErrorMock, productsRemoveMutationErrorMock]}
        addTypename={false}
      >
        <ProductList queryParams={''} history={history} />
      </MockedProvider>
    );

    await wait(0);

    const tree = testRenderer.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[productsRemoveMutationMock, productsCountMock,
          productCategoryDetailQueryMock, productsQueryMock]}
        addTypename={false}
      >
        <ProductList queryParams={''} history={history} />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
