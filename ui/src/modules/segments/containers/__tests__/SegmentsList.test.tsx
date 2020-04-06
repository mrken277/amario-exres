import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { segmentFactory } from 'modules/testing-utils/factories/segments';
import { withRouter } from 'modules/testing-utils/withRouter';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';
import SegmentListContainer from '../SegmentsList';

const contentType = 'customer';
const segmentVariables = { contentType };

const segmentsErrorMock = {
  request: {
    query: gql(queries.segments),
    variables: segmentVariables
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const configQueryMock = {
  request: {
    query: gql(queries.segments),
    variables: segmentVariables
  },
  result: {
    data: {
      configsDetail: [
        segmentFactory.build(),
        segmentFactory.build({
          _id: 'id'
        })
      ]
    }
  }
};

const removeSegmentMutationMocks = {
  request: {
    query: gql(mutations.segmentsRemove),
    variables: { _id: '' }
  },
  result: {
    data: {
      _id: ''
    }
  }
};

describe('SegmentsList', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <SegmentListContainer contentType="" />
      </MockedProvider>
    );

    const testInstance = testRenderer.root;
    const loader = testInstance.findByProps({ objective: true }).type;

    const spinner = loader({});

    expect(spinner.props.objective).toEqual(false);
  });

  it('error', async () => {
    const testRenderer = create(
      <MockedProvider mocks={[segmentsErrorMock]} addTypename={false}>
        <SegmentListContainer contentType={contentType} />
      </MockedProvider>
    );

    await wait(0);

    const testInstance = testRenderer.root;
    const span = testInstance.findByType('span');
    expect(span.children).toContain('forced error');
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[configQueryMock, removeSegmentMutationMocks]}
        addTypename={false}
      >
        {withRouter(<SegmentListContainer contentType={contentType} />)}
      </MockedProvider>
    );

    await wait(0); // wait for response

    const testInstance = testRenderer.root;
    expect(testRenderer.toJSON()).toMatchSnapshot();

    expect(
      testInstance.findByType(SegmentListContainer).props.contentType
    ).toBe(contentType);
  });
});
