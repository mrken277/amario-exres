import { IBrand } from 'modules/settings/brands/types';
import * as React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  brand: IBrand;
  modalKey?: string;
};

class Brand extends React.PureComponent<Props> {
  render() {
    const { brand, modalKey } = this.props;
    const modal = modalKey && `#${modalKey}`;

    return (
      <Link to={`/settings/brands?_id=${brand._id}${modal}`}>
        {brand.name || 'Unknown'}
      </Link>
    );
  }
}

export default Brand;
