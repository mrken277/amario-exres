import AddForm from 'modules/boards/containers/portable/AddForm';
import ModalTrigger from 'modules/common/components/ModalTrigger';
import React from 'react';
import { IOptions } from '../../types';

type Props = {
  relType: string;
  relTypeIds?: string[];
  assignedUserIds?: string[];
  options: IOptions;
  refetch?: () => void;
  sourceKind?: string;
  sourceKindId?: string;
};

export default (props: Props) => {
  const {
    relType,
    relTypeIds,
    options,
    refetch,
    assignedUserIds,
    sourceKind,
    sourceKindId
  } = props;
  const { addText, convertToText } = options.texts;
  const title = sourceKind ? convertToText : addText;

  const trigger = <a href="#title">{title}</a>;

  const content = formProps => (
    <AddForm
      options={options}
      {...formProps}
      refetch={refetch}
      relType={relType}
      relTypeIds={relTypeIds}
      assignedUserIds={assignedUserIds}
      sourceKind={sourceKind}
      sourceKindId={sourceKindId}
      showSelect={true}
    />
  );

  return <ModalTrigger title={title} trigger={trigger} content={content} />;
};
