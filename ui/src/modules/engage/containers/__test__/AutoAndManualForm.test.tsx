import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { emailTemplateFactory } from 'modules/testing-utils/factories/engage';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import AutoAndManualForm from '../AutoAndManualForm';

const kind = 'string';
const brands = [];
// const scheduleDate = {};

const emailTemplateMock = {
  request: {
    query: gql(queries.emailTemplates),
    variables: {}
  },
  result: {
    data: {
      emailTemplate: [
        emailTemplateFactory.build(),
        emailTemplateFactory.build({
          _id: '2',
          name: 'Erkhet'
        })
      ]
    }
  }
};

const emailTemplateErrorMock = {
  request: {
    query: gql(queries.emailTemplates),
    variables: {}
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('AutoAndManualForm', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <AutoAndManualForm kind={kind} brands={brands} />
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
        mocks={[emailTemplateErrorMock]}
        addTypename={false}
      >
        <AutoAndManualForm kind={kind} brands={brands} />
      </MockedProvider>
    );

    const testInstance = testRenderer.root;
    const span = testInstance.findByType('span');
    expect(span.children).toContain('forced error');
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[emailTemplateMock]}
        addTypename={false}
      >
        <AutoAndManualForm kind={kind} brands={brands} />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
