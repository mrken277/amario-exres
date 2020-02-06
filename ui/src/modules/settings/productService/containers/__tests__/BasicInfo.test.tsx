import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations } from '../../graphql';
import BasicInfo from '../product/detail/BasicInfo';

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

describe('BasicInfo', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <BasicInfo />
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
        mocks={[productsRemoveMutationErrorMock]}
        addTypename={false}
      >
        <BasicInfo />
      </MockedProvider>
    );

    await wait(0);

    const tree = testRenderer.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[productsRemoveMutationMock]}
        addTypename={false}
      >
        <BasicInfo />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
