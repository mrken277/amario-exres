import { MockedProvider, wait } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { queries } from 'modules/activityLogs/graphql';
import { queries as engageQueries } from 'modules/engage/graphql';
import { emailDeliveryFactory } from 'modules/testing-utils/factories/email';
import { engageMessageFactory } from 'modules/testing-utils/factories/engage';
import { withRouter } from 'modules/testing-utils/withRouter';
import * as React from 'react';
import { create } from 'react-test-renderer';
import EmailContainer from '../items/Email';

const emailVariables = { _id: '11' };
const activity = 'any';
const emailType = 'engage';
const emailId = '11';

const engageMessageErrorMock = {
  request: {
    query: gql(engageQueries.engageMessageDetail),
    variables: emailVariables,
  },
  result: {
    errors: [new GraphQLError('errorEngageMessage!')],
  }
};

const emailDeliveryErrorMock = {
  request: {
    query: gql(queries.emailDeliveryDetail),
    variables: emailVariables,
  },
  result: {
    errors: [new GraphQLError('errorEmailDelivery!')],
  }
};

const emailDeliveryMock = {
  request: {
    query: gql(queries.emailDeliveryDetail),
    variables: emailVariables,
  },
  result: {
    data: {
      emailDeliveryDetail: [
        emailDeliveryFactory.build(),
        emailDeliveryFactory.build({
          _id: '3'
        })
      ]
    },
  },
};

const engageMessageMock = {
  request: {
    query: gql(engageQueries.engageMessageDetail),
    variables: emailVariables,
  },
  result: {
    data: {
      engageMessageDetail: [
        engageMessageFactory.build(),
        engageMessageFactory.build({
          _id: '3'
        })
      ]
    },
  },
};


describe('email', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <EmailContainer
          activity={activity}
          emailId={emailId}
          emailType={emailType}
        />
      </MockedProvider>
    );

    const testInstance = testRenderer.root;
    const loader = testInstance.findByProps({ objective: true }).type;

    const spinner = loader({});

    expect(spinner.props.objective).toEqual(false);
  });

  it('error', async () => {
    const testRenderer = create(
      <MockedProvider mocks={[emailDeliveryErrorMock, engageMessageErrorMock]} addTypename={false}>
        <EmailContainer
          activity={activity}
          emailId={emailId}
          emailType={emailType}
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
      <MockedProvider mocks={[emailDeliveryMock, engageMessageMock]} addTypename={false}>
        {withRouter(
          <EmailContainer
            activity={activity}
            emailId={emailId}
            emailType={emailType}
          />
        )}
      </MockedProvider>
    );
    await wait(0);

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});


