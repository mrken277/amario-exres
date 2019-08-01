import PortableItems from 'modules/boards/containers/portable/Items';
import React from 'react';
import options from '../options';

type IProps = {
  contentType?: string;
  contentId?: string;
  isOpen?: boolean;
};

export default (props: IProps) => {
  return <PortableItems options={options} {...props} />;
};
