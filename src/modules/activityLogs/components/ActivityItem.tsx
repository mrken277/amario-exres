import { __ } from 'modules/common/utils';
import React from 'react';
import InternalNote from '../containers/items/InternalNote';
import Task from '../containers/items/Task';

type Props = {
  data: any;
};

const ConforItem = (props: Props) => {
  const { data } = props;
  const { relType, relTypeId } = data;

  if (relType === 'note') {
    return <InternalNote noteId={relTypeId} activity={data} />;
  }

  if (relType === 'task') {
    return <Task taskId={relTypeId} activity={data} />;
  }

  return <div>Task</div>;
};

export default ConforItem;
