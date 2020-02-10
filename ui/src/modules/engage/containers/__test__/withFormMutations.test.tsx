import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { engageMessageFactory } from 'modules/testing-utils/factories/engage';
import { userFactory } from 'modules/testing-utils/factories/user';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';
import withFormMutations from '../withFormMutations';

const kind = '';
const messageId = 'string';

const engageMessageDetailsMock = {
  request: {
    query: gql(queries.engageMessageDetail),
    variables: { _id: 'string' }
  },
  result: {
    data: {
      engageMessageDetails: [
        engageMessageFactory.build(),
        engageMessageFactory.build({
          _id: '1'
        }),
      ]
    }
  }
};

const usersMock = {
  request: {
    query: gql(queries.users),
    variables: {}
  },
  result: {
    data: {
      users: [
        userFactory.build(),
        userFactory.build({
          _id: '1'
        }),
      ]
    }
  }
};

const WithFormMutationVariables = {
  name: 'string',
  description: 'string',
  subOf: 'string',
  color: 'string',
  connector: 'string',
  conditions: []
};


const messagesAddMock = {
  request: {
    query: gql(mutations.messagesAdd),
    variables: WithFormMutationVariables
  },
  result: {
    data: {}
  }
};

const messagesAddErrorMock = {
  request: {
    query: gql(mutations.messagesAdd),
    variables: WithFormMutationVariables
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('withFormMutations', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <withFormMutations kind={kind} messageId={messageId} />
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
        mocks={[engageMessageDetailsMock, usersMock, messagesAddErrorMock]}
        addTypename={false}
      >
        <withFormMutations kind={kind} messageId={messageId} />
      </MockedProvider>
    );

    const testInstance = testRenderer.root;
    const span = testInstance.findByType('span');
    expect(span.children).toContain('forced error');
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[engageMessageDetailsMock, usersMock, messagesAddMock]}
        addTypename={false}
      >
        <withFormMutations kind={kind} messageId={messageId} />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
