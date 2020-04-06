import { MockedProvider } from '@apollo/react-testing';
import gql from 'graphql-tag';
import { segmentFactory } from 'modules/testing-utils/factories/segments';
import { withRouter } from 'modules/testing-utils/withRouter';
import * as React from 'react';
import * as renderer from 'react-test-renderer';
import wait from 'waait';
import SegmentListContainer from '../SegmentsList';

const contentType = 'customer';
const segmentVariables = { contentType };

const segmentFields = `
  _id
  contentType
  name
  description
  subOf
  color
  conditions
`;

const segments1 = `
  query segments($contentType: String!) {
    segments(contentType: $contentType) {
      ${segmentFields}

      getSubSegments {
        ${segmentFields}
      }
    }
  }
`;

const segmentsQueryMock = {
  request: {
    query: gql(segments1),
    variables: segmentVariables
  },
  result: {
    data: {
      segments: [
        segmentFactory.build(),
        segmentFactory.build({
          _id: 'id'
        })
      ]
    }
  }
};

it('SegmentsList', async () => {
  const component = renderer.create(
    <MockedProvider mocks={[segmentsQueryMock]}>
      {withRouter(<SegmentListContainer contentType={contentType} />)}
    </MockedProvider>
  );

  await renderer.act(wait);

  const testInstance = component.root;

  expect(testInstance.findByType('button').props.icon).toBe('plus-circle');
});
