import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { configsDetailFactory } from 'modules/testing-utils/factories/settings/general';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { mutations, queries } from '../../graphql';
import ListContainer from '../List';

const configVariables = { code: '' };

const configErrorMock = {
  request: {
    query: gql(queries.configsDetail),
    variables: configVariables,
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const configQueryMock = {
  request: {
    query: gql(queries.configsDetail),
    variables: configVariables,
  },
  result: {
    data: {
      configsDetail: [configsDetailFactory.build()]
    },
  },
};

const insertConfigMutationMocks = {
  request: {
    query: gql(mutations.insertConfig),
    variables: { code: '', value: [''] },
  },
  result: {
    data: {
      code: '', value: ['']
    }
  },
};

describe('Account default', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <ListContainer />
      </MockedProvider>
    );

    const testInstance = testRenderer.root;
    const loader = testInstance.findByProps({ objective: true }).type;

    const spinner = loader({});

    expect(spinner.props.objective).toEqual(false);
  });

  it('error', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[configErrorMock]}
        addTypename={false}
      >
        <ListContainer />
      </MockedProvider>
    );

    await wait(0);

    const tree = testRenderer.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[configQueryMock, insertConfigMutationMocks]}
        addTypename={false}
      >
        <ListContainer />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
