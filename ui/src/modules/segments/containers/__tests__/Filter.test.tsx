import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { createMemoryHistory } from 'history';
// tslint:disable-next-line:ordered-imports
import { segmentFactory } from 'modules/testing-utils/factories/segments';
import { withRouter } from 'modules/testing-utils/withRouter';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import FilterContainer from '../Filter';

const segmentsErrorMock = {
  request: {
    query: gql(queries.segments),
    variables: { contentType: 'type' },
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const segmentsQueryMock = {
  request: {
    query: gql(queries.segmentDetail),
    variables: { contentType: 'type' },
  },
  result: {
    data: {
      segmentDetail: [
        segmentFactory.build(),
        segmentFactory.build({
          _id: '1'
        })
      ]
    },
  },
};

const route = '/segments/:contentType';
const history = createMemoryHistory({
  initialEntries: [route]
});

const counts = { "key": 0 }

describe('Account default', () => {
  it('should render loading state initially', () => {
    const component = create(
      <MockedProvider mocks={[]}>
        {withRouter(
          <FilterContainer contentType='' counts={counts} history={history} />
        )}
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
        <FilterContainer contentType='' counts={counts} history={history} />
      </MockedProvider>
    );

    await wait(0);

    const tree = component.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const component = create(
      <MockedProvider
        mocks={[segmentsQueryMock]}
        addTypename={false}
      >
        <FilterContainer contentType='' counts={counts} history={history} />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = component.toJSON();
    expect(tree).toBe(null);
  });
});
