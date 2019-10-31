import { ICompany } from 'modules/companies/types';
import * as React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  company: ICompany;
};

class Company extends React.Component<Props> {
  render() {
    const { company } = this.props;

    return (
      <Link to={`/contacts/companies/details/${company._id}`}>
        {company.primaryName || company.primaryEmail || 'Unknown'}
      </Link>
    );
  }
}

export default Company;
