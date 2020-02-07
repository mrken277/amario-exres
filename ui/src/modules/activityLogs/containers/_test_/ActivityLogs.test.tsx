import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import ActivityLogs from '../ActivityLogs';

const LogsVariables = {
  contentId: '11',
  contentType: 'type',
  activityType: 'activity',
  limit: 1
};

const contentId = 'any';
const contentType = 'engage';
const target = '11';
const extraTabs = [{ name: '', label: '' }];

const ActivityLogErrorMock = {
  request: {
    query: gql(queries.activityLogs),
    variables: LogsVariables,
  },
  result: {
    errors: [new GraphQLError('errorEngageMessage!')],
  }
};

const ActivityLogMock = {
  request: {
    query: gql(queries.activityLogs),
    variables: LogsVariables,
  },
  result: {
    data: {
      ActivityLogDetail: [{
        _id: '3'
      }]
    },
  },
};

describe('ActivityLogs', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <ActivityLogs
          contentId={contentId}
          contentType={contentType}
          target={target}
          extraTabs={extraTabs}
        />
      </MockedProvider>
    );

    const testInstance = testRenderer.root;
    const loader = testInstance.findByProps({ objective: true }).type;

    const spinner = loader({});

    expect(spinner.props.objective).toEqual(false);
  });

  it('Should show error', async () => {
    const testRenderer = create(
      <MockedProvider mocks={[ActivityLogErrorMock]} addTypename={false}>
        <ActivityLogs
          contentId={contentId}
          contentType={contentType}
          target={target}
          extraTabs={extraTabs}
        />
      </MockedProvider>
    );

    await wait(0);

    const testInstance = testRenderer.root;
    const span = testInstance.findByType('span');
    expect(span.children).toContain('forced error');
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider mocks={[ActivityLogMock]} addTypename={false}>
        <ActivityLogs
          contentId={contentId}
          contentType={contentType}
          target={target}
          extraTabs={extraTabs}
        />
      </MockedProvider>
    );
    await wait(0);

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});


