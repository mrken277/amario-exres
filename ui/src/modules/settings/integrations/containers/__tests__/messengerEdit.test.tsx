import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { queries as kbQueries } from 'modules/knowledgeBase/graphql';
import { queries as brandQueries } from 'modules/settings/brands/graphql';
import { userFactory } from 'modules/testing-utils/factories/auth';
import { topicFactory } from 'modules/testing-utils/factories/knowledgebase';
import { brandFactory } from 'modules/testing-utils/factories/settings/brands';
import { integrationFactory } from 'modules/testing-utils/factories/settings/integration';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';
import EditMessenger from '../messenger/Edit';

const usersQueryMock = {
  request: {
    query: gql(queries.users)
  },
  result: {
    data: {
      users: [userFactory.build()]
    },
  },
};

const usersQueryErrorMock = {
  request: {
    query: gql(queries.users)
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const brandsQueryMock = {
  request: {
    query: gql(brandQueries.brands)
  },
  result: {
    data: {
      brands: [brandFactory.build()]
    },
  },
};

const brandsQueryErrorMock = {
  request: {
    query: gql(brandQueries.brands)
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const topicsQueryMock = {
  request: {
    query: gql(kbQueries.knowledgeBaseTopics)
  },
  result: {
    data: {
      knowledgeBaseTopics: [topicFactory.build()]
    },
  },
};

const topicsQueryErrorMock = {
  request: {
    query: gql(kbQueries.knowledgeBaseTopics)
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const integrationDetailQueryMock = {
  request: {
    query: gql(queries.integrationDetail),
    variables: { _id: '1' }
  },
  result: {
    data: {
      integrationDetail: integrationFactory.build()
    },
  },
};

const integrationDetailQueryErrorMock = {
  request: {
    query: gql(queries.integrationDetail),
    variables: { _id: '1' }
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const editMessengerVariables = {
  _id: '1',
  name: 'nmma',
  brandId: '2',
  languageCode: 'mn'
}

const editMessengerMock = {
  request: {
    query: gql(mutations.integrationsEditMessenger),
    variables: editMessengerVariables
  },
  result: {
    data: { editMessengerVariables }
  },
};

const editMessengerErrorMock = {
  request: {
    query: gql(mutations.integrationsEditMessenger),
    variables: editMessengerVariables
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const saveMessengerConfigsMock = {
  request: {
    query: gql(mutations.integrationsSaveMessengerConfigs)
  },
  result: {
    data: {}
  },
};

const saveMessengerConfigsErrorMock = {
  request: {
    query: gql(mutations.integrationsSaveMessengerConfigs)
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const saveMessengerAppearanceMock = {
  request: {
    query: gql(mutations.integrationsSaveMessengerAppearance)
  },
  result: {
    data: {}
  },
};

const saveMessengerAppearanceErrorMock = {
  request: {
    query: gql(mutations.integrationsSaveMessengerAppearance)
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

describe('EditMessenger', () => {
  it('should render loading state initially', () => {
    const component = create(
      <MockedProvider mocks={[]}>
        <EditMessenger integrationId="1" />
      </MockedProvider>
    );

    const tree = component.toJSON();
    expect(tree.children).toContain('Loading...');
  });

  it('error', async () => {
    const component = create(
      <MockedProvider
        mocks={[usersQueryErrorMock, brandsQueryErrorMock,
          topicsQueryErrorMock, editMessengerErrorMock,
          integrationDetailQueryErrorMock,
          saveMessengerConfigsErrorMock, saveMessengerAppearanceErrorMock]}
        addTypename={false}
      >
        <EditMessenger integrationId="1" />
      </MockedProvider>
    );

    await wait(0);

    const tree = component.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const component = create(
      <MockedProvider
        mocks={[usersQueryMock, brandsQueryMock, topicsQueryMock,
          editMessengerMock, integrationDetailQueryMock, saveMessengerConfigsMock,
          saveMessengerAppearanceMock]}
        addTypename={false}
      >
        <EditMessenger integrationId="1" />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = component.toJSON();
    expect(tree).toBe(null);
  });
});
