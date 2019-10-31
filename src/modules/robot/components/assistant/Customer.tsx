import { renderFullName } from 'modules/common/utils';
import { ICustomer } from 'modules/customers/types';
import * as React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  customer: ICustomer;
};

class Customer extends React.Component<Props> {
  render() {
    const { customer } = this.props;

    return (
      <Link to={`/contacts/customers/details/${customer._id}`}>
        {renderFullName(customer)}
      </Link>
    );
  }
}

export default Customer;
