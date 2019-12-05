import AddTrigger from 'modules/boards/components/portable/AddTrigger';
import React from 'react';
import options from '../options';

type Props = {
  relType: string;
  relTypeIds?: string[];
  assignedUserIds?: string[];
  sourceKind?: string;
  sourceKindId?: string;
};

export default (props: Props) => {
  return <AddTrigger {...props} options={options} />;
};
