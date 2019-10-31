import gql from 'graphql-tag';
import { withProps } from 'modules/common/utils';
import { CustomerDetailQueryResponse } from 'modules/customers/types';
import Customer from 'modules/robot/components/assistant/Customer';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { queries } from '../../graphql';

type Props = {
  id: string;
};

type FinalProps = {
  customerDetailQuery: CustomerDetailQueryResponse;
} & Props;

class CustomerContainer extends React.Component<FinalProps> {
  render() {
    const { customerDetailQuery } = this.props;

    const customer = customerDetailQuery.customerDetail || {};

    if (customerDetailQuery.loading) {
      return null;
    }

    const updatedProps = {
      ...this.props,
      customer
    };

    return <Customer {...updatedProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.customerDetail), {
      options: ({ id }) => ({
        variables: { _id: id }
      }),
      name: 'customerDetailQuery'
    })
  )(CustomerContainer)
);
