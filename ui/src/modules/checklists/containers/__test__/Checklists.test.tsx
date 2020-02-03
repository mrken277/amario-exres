import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { Checklists } from 'modules/checklists/containers/Checklists';
import { checkListFactory } from 'modules/testing-utils/factories/checkLists';
import { withRouter } from 'modules/testing-utils/withRouter';
import * as React from 'react';
import { act, create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';


const contentType = 'type';
const contentTypeId = 'string';
const stageId = 'string';
const addItem = {};


const checklistMock = {
  request: {
    query: gql(queries.checklists),
    variables: { contentType: 'string', contentTypeId: 'string' }
  },
  result: {
    data: {
      checklist: [
        checkListFactory.build(),
        checkListFactory.build({
          _id: '2'
        })
      ]
    }
  }
};

const checklistErrorMock = {
  request: {
    query: gql(queries.checklists),
    variables: { contentType: 'string', contentTypeId: 'string' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('Checklist test', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <Checklists contentType={contentType} contentTypeId={contentTypeId} stageId={stageId} addItem={addItem} />
      </MockedProvider>
    );

    const testInstance = testRenderer.root;
    const loader = testInstance.findByProps({ objective: true }).type;

    const spinner = loader({});

    expect(spinner.props.objective).toEqual(false);
  });

  it('should show error checklist', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[checklistErrorMock]}
        addTypename={false}
      >
        {withRouter(
          <Checklists contentType={contentType} contentTypeId={contentTypeId} stageId={stageId} addItem={addItem} />
        )}
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
        mocks={[checklistMock]}
        addTypename={false}
      >
        {withRouter(
          <Checklists contentType={contentType} contentTypeId={contentTypeId} stageId={stageId} addItem={addItem} />
        )}
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
