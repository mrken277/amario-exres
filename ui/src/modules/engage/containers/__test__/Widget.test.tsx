import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { brandFactory } from 'modules/testing-utils/factories/settings/brands';
import { emailTemplateFactory } from 'modules/testing-utils/factories/settings/emailTemplates';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';
import Widget from '../Widget';


const customers = [];
// const emptyBulk?=() => void;
const modalTrigger = '';
const channelType = 'string';

const emailTemplatesMock = {
  request: {
    query: gql(queries.emailTemplates),
    variables: {}
  },
  result: {
    data: {
      emailTemplates: [
        emailTemplateFactory.build(),
        emailTemplateFactory.build({
          _id: '1'
        }),
      ]
    }
  }
};

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
          _id: '1'
        }),
      ]
    }
  }
};
const messagesAddVariables = {
  kind: 'auto',
  type: 'email',
  segmentIds: ['1,2'],
  brandIds: ['3,4'],
  customerIds: ['3,4'],
  title: 'test',
  fromUserId: '22',
  method: '22',
  isDraft: true,
  isLive: false,
  email: {},
  messenger: {},
  scheduleDate: {},
  month: 'July', day: '12', time: '2'
};


const messagesAddMock = {
  request: {
    query: gql(mutations.messagesAdd),
    variables: messagesAddVariables
  },
  result: {
    data: {}
  }
};

const messagesAddErrorMock = {
  request: {
    query: gql(mutations.messagesAdd),
    variables: messagesAddVariables
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('Widget', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <Widget customers={customers} modalTrigger={modalTrigger} channelType={channelType} />
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
        mocks={[emailTemplatesMock, brandsMock, messagesAddErrorMock]}
        addTypename={false}
      >
        <Widget customers={customers} modalTrigger={modalTrigger} channelType={channelType} />
      </MockedProvider>
    );

    const testInstance = testRenderer.root;
    const span = testInstance.findByType('span');
    expect(span.children).toContain('forced error');
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[emailTemplatesMock, brandsMock, messagesAddMock]}
        addTypename={false}
      >
        <Widget customers={customers} modalTrigger={modalTrigger} channelType={channelType} />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
