import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { brandFactory } from 'modules/testing-utils/factories/settings/brands';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import BrandStep from '../BrandStep';

const messageType = 'string';
const brandIds = [];
const onChange = { name: 'string', value: [''] };
const renderContent = {};

const brandsMock = {
  request: {
    query: gql(queries.brands),
    variables: {}
  },
  result: {
    data: {
      brands: [
        brandFactory.build(),
        brandFactory.build({
          _id: '2',
          name: 'Erkhet'
        })
      ]
    }
  }
};

const CountResponse = {
  type: 1
};

const CustomerCounts = {
  byBrand: CountResponse,
  byFakeSegment: 3,
  byForm: CountResponse,
  byIntegrationType: CountResponse,
  byLeadStatus: CountResponse,
  byLifecycleState: CountResponse,
  bySegment: CountResponse,
  byTag: CountResponse,
};

const CountQueryMock = {
  request: {
    query: gql(queries.customerCounts),
    variables: { only: 'string' }
  },
  result: {
    data: {
      CountQuery: [
        {
          customerCounts: CustomerCounts
        }
      ]
    }
  }
};

const CountQueryErrorMock = {
  request: {
    query: gql(queries.customerCounts),
    variables: { only: 'string' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('BrandStep', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <BrandStep messageType={messageType} brandIds={brandIds} onChange={onChange} renderContent={renderContent} />
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
        mocks={[brandsMock, CountQueryErrorMock]}
        addTypename={false}
      >
        <BrandStep messageType={messageType} brandIds={brandIds} onChange={onChange} renderContent={renderContent} />
      </MockedProvider>
    );

    const testInstance = testRenderer.root;
    const span = testInstance.findByType('span');
    expect(span.children).toContain('forced error');
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[brandsMock, CountQueryMock]}
        addTypename={false}
      >
        <BrandStep messageType={messageType} brandIds={brandIds} onChange={onChange} renderContent={renderContent} />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
