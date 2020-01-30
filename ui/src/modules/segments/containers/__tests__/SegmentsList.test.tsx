import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';
import SegmentListContainer from '../SegmentsList';
import { segmentFactory } from 'modules/testing-utils/factories/segments';

const segmentVariables = { contentType: '' };

const segmentsErrorMock = {
  request: {
    query: gql(queries.segments),
    variables: segmentVariables,
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const configQueryMock = {
  request: {
    query: gql(queries.segments),
    variables: segmentVariables,
  },
  result: {
    data: {
      configsDetail: [
        segmentFactory.build(),
        segmentFactory.build({
          _id: 'id'
        })
      ]
    },
  },
};

const removeSegmentMutationMocks = {
  request: {
    query: gql(mutations.segmentsRemove),
    variables: { _id: '' },
  },
  result: {
    data: {
      _id: ''
    }
  },
};

describe('Account default', () => {
  it('should render loading state initially', () => {
    const component = create(
      <MockedProvider mocks={[]}>
        <SegmentListContainer contentType='' />
      </MockedProvider>
    );

    const tree = component.toJSON();
    expect(tree.children).toContain('Loading...');
  });

  it('error', async () => {
    const component = create(
      <MockedProvider
        mocks={[segmentsErrorMock]}
        addTypename={false}
      >
        <SegmentListContainer contentType='' />
      </MockedProvider>
    );

    await wait(0);

    const tree = component.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const component = create(
      <MockedProvider
        mocks={[configQueryMock, removeSegmentMutationMocks]}
        addTypename={false}
      >
        <SegmentListContainer contentType='' />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = component.toJSON();
    expect(tree).toBe(null);
  });
});
