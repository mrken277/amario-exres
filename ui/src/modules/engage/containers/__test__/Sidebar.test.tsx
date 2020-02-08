import { MockedProvider } from '@apollo/react-testing';
import gql from 'graphql-tag';
import { queries as tagQueries } from 'modules/tags/graphql';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import Sidebar from '../Sidebar';

const queryParams = 'any';

const EngageMessageCounts = {
  all: 3,
  auto: 3,
  manual: 3,
  visitoryAuto: 3,
};

const kindCountsMock = {
  request: {
    query: gql(queries.kindCounts),
    variables: {}
  },
  result: {
    data: {
      engageMessageCounts: EngageMessageCounts
    }
  }
};

// const engageMessageDetailErrorMock = {
//   request: {
//     query: gql(queries.engageMessageStats),
//     variables: { _id: '' }
//   },
//   result: {
//     errors: [new GraphQLError('forced error')]
//   }
// };

const statusCountsMock = {
  request: {
    query: gql(tagQueries.tags),
    variables: { type: 'string' }
  },
  result: {
    data: {
      count: 3
    }
  }
};

const tagCountsMock = {
  request: {
    query: gql(queries.tagCounts),
    variables: { kind: 'string', status: 'string' }
  },
  result: {
    data: {
      engageMessageCounts: EngageMessageCounts
    }
  }
};

describe('Sidebar', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <Sidebar queryParams={queryParams} />
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
        mocks={[kindCountsMock, statusCountsMock, tagCountsMock]}
        addTypename={false}
      >
        <Sidebar queryParams={queryParams} />
      </MockedProvider>
    );

    const testInstance = testRenderer.root;
    const span = testInstance.findByType('span');
    expect(span.children).toContain('forced error');
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[kindCountsMock, statusCountsMock, tagCountsMock]}
        addTypename={false}
      >
        <Sidebar queryParams={queryParams} />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});
