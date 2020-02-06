import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { mutations as integrationMutations } from 'modules/settings/integrations/graphql';
import { integrationsCountFactory, leadIntegrationFactory } from 'modules/testing-utils/factories/leads';
import { tagFactory } from 'modules/testing-utils/factories/tags';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';
import List from '../List';


const queryParams = 'any';

const integrationsMock = {
  request: {
    query: gql(queries.integrations),
    variables: { page: 1, perPage: 20, tag: 'string', kind: 'string' }
  },
  result: {
    data: {
      integrations: [
        leadIntegrationFactory.build(),
        leadIntegrationFactory.build({
          _id: '3'
        })
      ]
    }
  }
};

const integrationsErrorMock = {
  request: {
    query: gql(queries.integrations),
    variables: { page: 1, perPage: 20, tag: 'string', kind: 'string' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};


const integrationsTotalCountQueryMock = {
  request: {
    query: gql(queries.integrationsTotalCount),
    variables: {}
  },
  result: {
    data: {
      integrationsTotalCount: [
        integrationsCountFactory.build(),
        integrationsCountFactory.build({
          total: 3
        }),
      ]
    }
  }
};

const integrationsTotalCountErrorMock = {
  request: {
    query: gql(queries.integrationsTotalCount),
    variables: {}
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const tagsMock = {
  request: {
    query: gql(queries.tags),
    variables: { type: 'integration' }
  },
  result: {
    data: {
      tags: [
        tagFactory.build(),
        tagFactory.build({
          _id: ''
        }),
      ]
    }
  }
};

const tagsErrorMock = {
  request: {
    query: gql(queries.tags),
    variables: { type: 'integration' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const integrationRemoveMock = {
  request: {
    query: gql(mutations.integrationRemove),
    variables: { _id: '' }
  },
  result: {
    data: {}
  }
};

const integrationRemoveErrorMock = {
  request: {
    query: gql(mutations.integrationRemove),
    variables: { _id: '' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

const archiveIntegrationMock = {
  request: {
    query: gql(integrationMutations.integrationsArchive),
    variables: { _id: '' }
  },
  result: {
    data: {}
  }
};

const archiveIntegrationErrorMock = {
  request: {
    query: gql(integrationMutations.integrationsArchive),
    variables: { _id: '' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('List of Leads', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <List queryParams={queryParams} />
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
        mocks={[integrationsTotalCountErrorMock, integrationsErrorMock, tagsErrorMock, integrationRemoveErrorMock, archiveIntegrationErrorMock]}
        addTypename={false}
      >
        <List queryParams={queryParams} />
      </MockedProvider>
    );

    await wait(0);

    const testInstance = testRenderer.root;
    const span = testInstance.findByType('span');
    expect(span.children).toContain('forced error');
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[integrationsMock, integrationsTotalCountQueryMock, tagsMock, integrationRemoveMock, archiveIntegrationMock]}
        addTypename={false}
      >
        <List queryParams={queryParams} />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
