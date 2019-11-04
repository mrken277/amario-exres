import { ICompany } from 'modules/companies/types';
import * as React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  company: ICompany;
};

function Company(props: Props) {
  const { company } = props;

  return (
    <Link to={`/contacts/companies/details/${company._id}`}>
      {company.primaryName || company.primaryEmail || 'Unknown'}
    </Link>
  );
}

export default Company;
