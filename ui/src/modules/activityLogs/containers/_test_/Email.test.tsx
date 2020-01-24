import { MockedProvider, wait } from '@apollo/react-testing';
import { act } from '@testing-library/react';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { queries } from 'modules/activityLogs/graphql';
import { queries as engageQueries } from 'modules/engage/graphql';
import { emailDeliveryFactory, engageMessageFactory, segmentFactory } from 'modules/testing-utils/factories/engage';
import { brandFactory } from 'modules/testing-utils/factories/settings/brands'
import { tagFactory } from 'modules/testing-utils/factories/tags';
import { userFactory } from 'modules/testing-utils/factories/user';
import { withRouter } from 'modules/testing-utils/withRouter';
import * as React from 'react';
import { create } from 'react-test-renderer';
import Email from '../items/Email';

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
          _id: '33',
          subject: 'test',
          body: 'Body',
          to: 'Dulam@yahoo.com',
          cc: 'erxes@gmail.com',
          bcc: 'erxes@nmma.co',
          attachments: [JSON],
          from: 'erxes',
          kind: 'auto',
          userId: '12',
          customerId: '22',

          fromUser: userFactory.build({ _id: '12' }),
          fromEmail: 'erxes@nmma.co'
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
          _id: '4',
          stopDate: new Date(),
          createdDate: new Date(),
          messengerReceivedCustomerIds: ['test', '4'],
          brand: brandFactory.build({ _id: '3', name: 'Erxes' }),
          segment: segmentFactory.build({ _id: '5' }),
          fromUser: userFactory.build({ _id: '12' }),
          tagIds: ['12', '13'],
          getTags: [
            tagFactory.build(),
            tagFactory.build({ _id: '23' })
          ],
          title: 'test'
        })
      ]
    },
  },
};


describe('email', () => {
  it('should render loading state initially', () => {
    const component = create(
      <MockedProvider mocks={[]}>
        <Email
          activity={activity}
          emailId={emailId}
          emailType={emailType}
        />
      </MockedProvider>
    );

    const tree = component.toJSON();
    expect(tree.children).toContain('Loading...');
  });

  it('error', async () => {
    const component = create(
      <MockedProvider mocks={[engageMessageErrorMock, emailDeliveryErrorMock]} addTypename={false}>
        {withRouter(
          <Email
            activity={activity}
            emailId={emailId}
            emailType={emailType}
          />
        )}
      </MockedProvider>
    );

    await act(async () => {
      await wait(0);
    });

    const tree = component.toJSON();
    expect(tree.children).toContain('Error!');
  });

  it('should render content', async () => {
    const component = create(
      <MockedProvider mocks={[emailDeliveryMock, engageMessageMock]} addTypename={false}>
        {withRouter(
          <Email
            activity={activity}
            emailId={emailId}
            emailType={emailType}
          />
        )}
      </MockedProvider>
    );
    await wait(0);

    const tree = component.toJSON();
    expect(tree).toBe(null);
  });
});
