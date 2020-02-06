import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { queries as brandQueries } from 'modules/settings/brands/graphql';
import { brandFactory } from 'modules/testing-utils/factories/settings/brands';
import { withRouter } from 'modules/testing-utils/withRouter';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import Config from '../Config';

const brandDetailQueryMock = {
    request: {
        query: gql(brandQueries.brandDetail),
        variables: { brandId: '1' }
    },
    result: {
        data: {
            brandDetail: brandFactory.build()
        }
    }
};

const brandDetailQueryErrorMock = {
    request: {
        query: gql(brandQueries.brandDetail),
        variables: { brandId: '1' }
    },
    result: {
        errors: [new GraphQLError('forced error')]
    }
};

describe('Config', () => {
    it('should render loading state initially', () => {
        const testRenderer = create(
            <MockedProvider mocks={[]}>
                <Config brandId="1" />
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
                mocks={[brandDetailQueryErrorMock]}
                addTypename={false}
            >
                {withRouter(
                    <Config brandId="1" />
                )}
            </MockedProvider>
        );

        await wait(0);

        const tree = testRenderer.toJSON();
        expect(tree.children).toContain('Error!')
    });

    it('should render content', async () => {
        const testRenderer = create(
            <MockedProvider
                mocks={[brandDetailQueryMock]}
                addTypename={false}
            >
                {withRouter(
                    <Config brandId="1" />
                )}
            </MockedProvider>
        );

        await wait(0); // wait for response

        const tree = testRenderer.toJSON();
        expect(tree).toBe(null);
    });
});
