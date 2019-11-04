import { IBrand } from 'modules/settings/brands/types';
import * as React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  brand: IBrand;
  modalKey?: string;
};

function Brand(props: Props) {
  const { brand, modalKey } = props;
  const modal = modalKey && `#${modalKey}`;

  return (
    <Link to={`/settings/brands?_id=${brand._id}${modal}`}>
      {brand.name || 'Unknown'}
    </Link>
  );
}

export default Brand;
