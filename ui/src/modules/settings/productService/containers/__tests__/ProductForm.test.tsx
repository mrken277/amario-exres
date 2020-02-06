import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { productCategoryFactory } from 'modules/testing-utils/factories/settings/productService';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import ProductForm from '../product/ProductForm';

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

describe('ProductForm', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <ProductForm />
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
        mocks={[productCategoriesErrorMock]}
        addTypename={false}
      >
        <ProductForm />
      </MockedProvider>
    );

    await wait(0);

    const tree = testRenderer.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[productCategoriesQueryMock]}
        addTypename={false}
      >
        <ProductForm />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
