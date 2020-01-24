import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { createMemoryHistory } from 'history';
// tslint:disable-next-line:ordered-imports
import { segmentFactory } from 'modules/testing-utils/factories/segments';
import { combinedFieldsFactory } from 'modules/testing-utils/factories/settings/properties';
import { withRouter } from 'modules/testing-utils/withRouter';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import SegmentsFormContainer from '../SegmentsForm';

const segmentDetailErrorMock = {
  request: {
    query: gql(queries.segmentDetail),
    variables: { _id: '' },
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const headSegmentsErrorMock = {
  request: {
    query: gql(queries.headSegments),
    variables: { contentType: 'type' },
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const combinedFieldsErrorMock = {
  request: {
    query: gql(queries.combinedFields),
    variables: { contentType: 'type' },
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const segmentDetailQueryMock = {
  request: {
    query: gql(queries.segmentDetail),
    variables: { _id: '1' },
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

const headSegmentsQueryMock = {
  request: {
    query: gql(queries.headSegments),
    variables: { contentType: 'type' },
  },
  result: {
    data: {
      segmentsGetHeads: [
        segmentFactory.build(),
        segmentFactory.build({
          _id: '1'
        })
      ]
    },
  },
};

const combinedFieldsQueryMock = {
  request: {
    query: gql(queries.combinedFields),
    variables: { contentType: 'type' },
  },
  result: {
    data: {
      fieldsCombinedByContentType: [
        combinedFieldsFactory.build(),
        combinedFieldsFactory.build({
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

describe('Account default', () => {
  it('should render loading state initially', () => {
    const component = create(
      <MockedProvider mocks={[]}>
        {withRouter(
          <SegmentsFormContainer contentType='' history={history} />
        )}
      </MockedProvider>
    );

    const tree = component.toJSON();
    expect(tree.children).toContain('Loading...');
  });

  it('error', async () => {
    const component = create(
      <MockedProvider
        mocks={[segmentDetailErrorMock, headSegmentsErrorMock, combinedFieldsErrorMock]}
        addTypename={false}
      >
        <SegmentsFormContainer contentType='' history={history} />
      </MockedProvider>
    );

    await wait(0);

    const tree = component.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const component = create(
      <MockedProvider
        mocks={[segmentDetailQueryMock, headSegmentsQueryMock, combinedFieldsQueryMock]}
        addTypename={false}
      >
        <SegmentsFormContainer contentType='' history={history} />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = component.toJSON();
    expect(tree).toBe(null);
  });
});
