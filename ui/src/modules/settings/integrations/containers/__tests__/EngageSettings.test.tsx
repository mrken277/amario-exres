import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { queries as engageQueries } from 'modules/engage/graphql';
import { mutations as engageMutations } from 'modules/engage/graphql';
import { engageConfigFactory } from 'modules/testing-utils/factories/engage';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import EngageSettings from '../engages/Settings';

const verifiedEmailsQueryMock = {
  request: {
    query: gql(engageQueries.verifiedEmails)
  },
  result: {
    data: {
      engageVerifiedEmails: ['']
    },
  },
};

const verifiedEmailsQueryErrorMock = {
  request: {
    query: gql(engageQueries.verifiedEmails)
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const configDetailQueryMock = {
  request: {
    query: gql(queries.engagesConfigDetail)
  },
  result: {
    data: {
      engagesConfigDetail: engageConfigFactory.build()
    },
  },
};

const configDetailQueryErrorMock = {
  request: {
    query: gql(queries.engagesConfigDetail)
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const verifyEmailMutationMock = {
  request: {
    query: gql(engageMutations.verifyEmail)
  },
  result: {
    data: {}
  },
};

const verifyEmailMutationErrorMock = {
  request: {
    query: gql(engageMutations.verifyEmail)
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const removeVerifiedEmailMock = {
  request: {
    query: gql(engageMutations.removeVerifiedEmail)
  },
  result: {
    data: {}
  },
};

const removeVerifiedEmailErrorMock = {
  request: {
    query: gql(engageMutations.removeVerifiedEmail)
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const sendTestEmailMock = {
  request: {
    query: gql(engageMutations.sendTestEmail)
  },
  result: {
    data: {}
  },
};

const sendTestEmailErrorMock = {
  request: {
    query: gql(engageMutations.sendTestEmail)
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

describe('EngageSettings', () => {
  it('should render loading state initially', () => {
    const component = create(
      <MockedProvider mocks={[]}>
        <EngageSettings />
      </MockedProvider>
    );

    const tree = component.toJSON();
    expect(tree.children).toContain('Loading...');
  });

  it('error', async () => {
    const component = create(
      <MockedProvider
        mocks={[verifiedEmailsQueryErrorMock, configDetailQueryErrorMock,
          verifyEmailMutationErrorMock, removeVerifiedEmailErrorMock,
          sendTestEmailErrorMock]}
        addTypename={false}
      >
        <EngageSettings />
      </MockedProvider>
    );

    await wait(0);

    const tree = component.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const component = create(
      <MockedProvider
        mocks={[verifiedEmailsQueryMock, configDetailQueryMock,
          verifyEmailMutationMock, removeVerifiedEmailMock,
          sendTestEmailMock]}
        addTypename={false}
      >
        <EngageSettings />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = component.toJSON();
    expect(tree).toBe(null);
  });
});
