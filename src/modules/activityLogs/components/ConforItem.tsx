import { __ } from 'modules/common/utils';
import React from 'react';
import InternalNote from '../containers/items/InternalNote';

type Props = {
  data: any;
};

const ConforItem = (props: Props) => {
  const { data } = props;
  const { relType, relTypeId } = data;

  if (relType === 'note') {
    return <InternalNote noteId={relTypeId} />;
  }

  return <div>skdjsakdj</div>;
};

export default ConforItem;
