import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { segmentFactory } from 'modules/testing-utils/factories/segments';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import SegmentStep from '../SegmentStep';

const segmentIds = ['string'];
const messageType = 'string';
const onChange = { name: 'string', value: ['string'] };

const segmentsMock = {
  request: {
    query: gql(queries.segments),
    variables: {}
  },
  result: {
    data: {
      segments: [
        segmentFactory.build(),
        segmentFactory.build({
          _id: '1'
        })
      ]
    }
  }
};

const CountResponse = {
  count: 11
};

const CustomerCounts = {
  byBrand: CountResponse,
  byFakeSegment: 1,
  byForm: CountResponse,
  byIntegrationType: CountResponse,
  byLeadStatus: CountResponse,
  byLifecycleState: CountResponse,
  bySegment: CountResponse,
  byTag: CountResponse,
};

const customerCountsMock = {
  request: {
    query: gql(queries.customerCounts),
    variables: { only: 'bySegment' }
  },
  result: {
    data: {
      customerCounts: CustomerCounts
    }
  }
};

const customerCountsErrorMock = {
  request: {
    query: gql(queries.customerCounts),
    variables: { only: 'bySegment' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('SegmentStep', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <SegmentStep segmentIds={segmentIds} messageType={messageType} onChange={onChange} />
      </MockedProvider>
    );

    const testInstance = testRenderer.root;
    const loader = testInstance.findByProps({ objective: true }).type;

    const spinner = loader({});

    expect(spinner.props.objective).toEqual(false);
  });

  it('should show error', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[customerCountsErrorMock, segmentsMock]}
        addTypename={false}
      >
        <SegmentStep segmentIds={segmentIds} messageType={messageType} onChange={onChange} />
      </MockedProvider>
    );

    const testInstance = testRenderer.root;
    const span = testInstance.findByType('span');
    expect(span.children).toContain('forced error');
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[customerCountsMock, segmentsMock]}
        addTypename={false}
      >
        <SegmentStep segmentIds={segmentIds} messageType={messageType} onChange={onChange} />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
