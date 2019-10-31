import gql from 'graphql-tag';
import { withProps } from 'modules/common/utils';
import { DetailQueryResponse as CompanyDetailQueryResponse } from 'modules/companies/types';
import Company from 'modules/robot/components/assistant/Company';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { queries } from '../../graphql';

type Props = {
  id: string;
};

type FinalProps = {
  companyDetailQuery: CompanyDetailQueryResponse;
} & Props;

class CompanyContainer extends React.Component<FinalProps> {
  render() {
    const { companyDetailQuery } = this.props;

    const company = companyDetailQuery.companyDetail || {};

    if (companyDetailQuery.loading) {
      return null;
    }

    const updatedProps = {
      ...this.props,
      company
    };

    return <Company {...updatedProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.companyDetail), {
      options: ({ id }) => ({
        variables: { _id: id }
      }),
      name: 'companyDetailQuery'
    })
  )(CompanyContainer)
);
