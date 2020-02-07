import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { productFactory } from 'modules/testing-utils/factories/settings/productService';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import ProductDetails from '../product/detail/ProductDetails';

const productDetailQueryMock = {
  request: {
    query: gql(queries.productDetail),
    variables: { _id: '1' }
  },
  result: {
    data: {
      productDetail: productFactory.build()
    },
  },
};

const productDetailErrorMock = {
  request: {
    query: gql(queries.productDetail),
    variables: { _id: '1' }
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

describe('ProductDetails', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <ProductDetails id="" />
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
        mocks={[productDetailErrorMock]}
        addTypename={false}
      >
        <ProductDetails id="" />
      </MockedProvider>
    );

    await wait(0);

    const tree = testRenderer.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[productDetailQueryMock]}
        addTypename={false}
      >
        <ProductDetails id="" />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
