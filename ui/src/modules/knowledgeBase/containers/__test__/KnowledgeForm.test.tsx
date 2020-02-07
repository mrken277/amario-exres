import { MockedProvider } from '@apollo/react-testing';
import gql from 'graphql-tag';
import { queries } from 'modules/settings/brands/graphql';
import { brandFactory } from 'modules/testing-utils/factories/settings/brands';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import KnowledgeForm from '../knowledge/KnowledgeForm';

const topic = {
  _id: '1',
  title: 'title',
  description: 'desc',
  categories: [],
  brand: brandFactory.build(),
  color: '#fff',
  backgroundImage: '/image',
  languageCode: 'mn',
  createdBy: 'user',
  createdDate: new Date(),
  modifiedBy: 'author',
  modifiedDate: new Date()
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
          _id: '2',
          name: 'Erkhet'
        })
      ]
    }
  }
};

describe('KnowledgeForm', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <KnowledgeForm topic={topic} />
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
        mocks={[brandsMock]}
        addTypename={false}
      >
        <KnowledgeForm topic={topic} />
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
        mocks={[brandsMock]}
        addTypename={false}
      >
        <KnowledgeForm topic={topic} />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
