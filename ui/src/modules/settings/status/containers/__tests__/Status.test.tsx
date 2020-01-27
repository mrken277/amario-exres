import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { projectVersionsFactory } from 'modules/testing-utils/factories/settings/status';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import StatusContainer from '../Status';

const statusErrorMock = {
  request: {
    query: gql(queries.configsVersions)
  },
  result: {
    errors: [new GraphQLError('forced error')],
  }
};

const statusQueryMock = {
  request: {
    query: gql(queries.configsVersions)
  },
  result: {
    data: {
      configsVersions: [
        projectVersionsFactory.build(),
        projectVersionsFactory.build({
          erxesVersion: {
            packageVersion: '1.3'
          }
        })
      ]
    },
  },
};

describe('Status', () => {
  it('should render loading state initially', () => {
    const component = create(
      <MockedProvider mocks={[]}>
        <StatusContainer />
      </MockedProvider>
    );

    const tree = component.toJSON();
    expect(tree.children).toContain('Loading...');
  });

  it('error', async () => {
    const component = create(
      <MockedProvider
        mocks={[statusErrorMock]}
        addTypename={false}
      >
        <StatusContainer />
      </MockedProvider>
    );

    await wait(0);

    const tree = component.toJSON();
    expect(tree.children).toContain('Error!')
  });

  it('should render content', async () => {
    const component = create(
      <MockedProvider
        mocks={[statusQueryMock]}
        addTypename={false}
      >
        <StatusContainer />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = component.toJSON();
    expect(tree).toBe(null);
  });
});
