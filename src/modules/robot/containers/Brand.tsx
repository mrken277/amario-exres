import gql from 'graphql-tag';
import { withProps } from 'modules/common/utils';
import { BrandDetailQueryResponse } from 'modules/settings/brands/types';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import Brand from '../components/notifier/Brand';
import { queries } from '../graphql';

type Props = {
  id: string;
  modalKey?: string;
};

type FinalProps = {
  brandDetailQuery: BrandDetailQueryResponse;
} & Props;

class BrandContainer extends React.Component<FinalProps> {
  render() {
    const { brandDetailQuery } = this.props;

    const brand = brandDetailQuery.brandDetail || {};

    if (brandDetailQuery.loading) {
      return null;
    }

    const updatedProps = {
      ...this.props,
      brand
    };

    return <Brand {...updatedProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.brandDetail), {
      options: ({ id }) => ({
        variables: { _id: id }
      }),
      name: 'brandDetailQuery'
    })
  )(BrandContainer)
);
