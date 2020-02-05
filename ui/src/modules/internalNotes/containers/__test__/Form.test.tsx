import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import * as React from 'react';
import { act, create } from 'react-test-renderer';
import wait from 'waait';
import { mutations } from '../../graphql';
import Form from '../Form'

const contentType = 'string';
const contentTypeId = 'string';

const popupsvariables = {
  contentType: 'string;',
  contentTypeId: 'string;',
  content: 'string;',
  mentionedUserIds: ['string']
};

const popUpsMock = {
  request: {
    query: gql(mutations.internalNotesAdd),
    variables: popupsvariables
  },
  result: {
    data: {}
  }
};

const popUpsErrorMock = {
  request: {
    query: gql(mutations.internalNotesAdd),
    variables: popupsvariables
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('popUps test', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <Form contentType={contentType} contentTypeId={contentTypeId} />
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
        mocks={[popUpsErrorMock]}
        addTypename={false}
      >
        <Form contentType={contentType} contentTypeId={contentTypeId} />
      </MockedProvider>
    );

    await act(async () => {
      await wait(0);
    });

    const testInstance = testRenderer.root;
    const span = testInstance.findByType('span');
    expect(span.children).toContain('forced error');
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[popUpsMock]}
        addTypename={false}
      >
        <Form contentType={contentType} contentTypeId={contentTypeId} />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
