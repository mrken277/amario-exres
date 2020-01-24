import SelectItem from 'modules/boards/components/SelectItem';
import { PRIORITIES } from 'modules/boards/constants';
import Watch from 'modules/boards/containers/editForm/Watch';
import LabelChooser from 'modules/boards/containers/label/LabelChooser';
import { ColorButton } from 'modules/boards/styles/common';
import { ActionContainer } from 'modules/boards/styles/item';
import { IItem, IOptions } from 'modules/boards/types';
import ChecklistAdd from 'modules/checklists/components/AddButton';
import Icon from 'modules/common/components/Icon';
import { colors } from 'modules/common/styles';
import { __ } from 'modules/common/utils';
import React from 'react';
import PriorityIndicator from './PriorityIndicator';

type Props = {
  item: IItem;
  options: IOptions;
  copyItem: () => void;
  removeItem: (itemId: string) => void;
  saveItem: (doc: { [key: string]: any }, callback?: (item) => void) => void;
  onUpdate: (item: IItem, prevStageId?: string) => void;
};

class Actions extends React.Component<Props> {
  onPriorityChange = (value: string) => {
    const { onUpdate, saveItem } = this.props;

    if (saveItem) {
      saveItem({ priority: value }, updatedItem => {
        onUpdate(updatedItem);
      });
    }
  };

  renderArchiveBtn() {
    const { removeItem, item, saveItem, onUpdate } = this.props;

    if (item.status === 'archived') {
      const onRemove = () => removeItem(item._id);
      const onSendToBoard = () => {
        saveItem({ status: 'active' }, updatedItem => {
          onUpdate(updatedItem);
        });
      };

      return (
        <>
          <ColorButton color={colors.colorCoreRed} onClick={onRemove}>
            <Icon icon="times-circle" />
            {__('Delete')}
          </ColorButton>
          <ColorButton onClick={onSendToBoard}>
            <Icon icon="refresh" />
            {__('Send to board')}
          </ColorButton>
        </>
      );
    }

    const onArchive = () => {
      saveItem({ status: 'archived' }, updatedItem => {
        onUpdate(updatedItem);
      });
    };

    return (
      <ColorButton onClick={onArchive}>
        <Icon icon="archive-alt" />
        {__('Archive')}
      </ColorButton>
    );
  }

  render() {
    const { item, saveItem, options, copyItem } = this.props;

    const onLabelChange = labels => saveItem({ labels });

    const priorityTrigger = (
      <ColorButton>
        {item.priority ? (
          <PriorityIndicator value={item.priority} />
        ) : (
          <Icon icon="sort-amount-up" />
        )}
        {item.priority ? item.priority : __('Priority')}
      </ColorButton>
    );

    return (
      <ActionContainer>
        <SelectItem
          items={PRIORITIES}
          selectedItems={item.priority}
          onChange={this.onPriorityChange}
          trigger={priorityTrigger}
        />

        <LabelChooser item={item} onSelect={onLabelChange} />

        <ChecklistAdd itemId={item._id} type={options.type} />

        <Watch item={item} options={options} isSmall={true} />

        <ColorButton onClick={copyItem}>
          <Icon icon="copy-1" />
          {__('Copy')}
        </ColorButton>

        {this.renderArchiveBtn()}
      </ActionContainer>
    );
  }
}

export default Actions;
