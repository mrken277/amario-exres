import { MockedProvider } from '@apollo/react-testing';
import gql from 'graphql-tag';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import EmailForm from '../EmailForm';

const onChange: (
  name: 'email' | 'content' | 'fromUserId' | 'scheduleDate',
  value: 'string'
) => void;
const message = 'string';
const users = [];
const templates = [];
const kind = 'string';
const email = {};
const fromUserId = 'string';
const content = 'string';
const scheduleDate = {};

const engageVerifiedEmailsMock = {
  request: {
    query: gql(queries.verifiedEmails),
    variables: {}
  },
  result: {
    data: {
      engageVerifiedEmails: [
        {
          engageVerifiedEmails: ['string']
        }
      ]
    }
  }
};


describe('EmailForm', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <EmailForm onChange={onChange} message={message} users={users} templates={templates} email={email} fromUserId={fromUserId} kind={kind}  content={content} scheduleDate={scheduleDate} />
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
        mocks={[engageVerifiedEmailsMock]}
        addTypename={false}
      >
        <EmailForm onChange={onChange} message={message} users={users} templates={templates} email={email} fromUserId={fromUserId} content={content} scheduleDate={scheduleDate} />
      </MockedProvider>
    );

    const testInstance = testRenderer.root;
    const span = testInstance.findByType('span');
    expect(span.children).toContain('forced error');
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[engageVerifiedEmailsMock]}
        addTypename={false}
      >
        <EmailForm onChange={onChange} message={message} users={users} templates={templates} email={email} fromUserId={fromUserId} content={content} scheduleDate={scheduleDate} />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
