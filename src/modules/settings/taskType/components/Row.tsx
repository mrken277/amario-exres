import ActionButtons from 'modules/common/components/ActionButtons';
import Button from 'modules/common/components/Button';
import Icon from 'modules/common/components/Icon';
import ModalTrigger from 'modules/common/components/ModalTrigger';
import Tip from 'modules/common/components/Tip';
import { IButtonMutateProps } from 'modules/common/types';
import { __ } from 'modules/common/utils';
import React from 'react';
import { ITaskType } from '../types';
import Form from './Form';

type Props = {
  taskType: ITaskType;
  remove: (taskTypeId: string) => void;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

class Row extends React.Component<Props> {
  remove = () => {
    const { taskType } = this.props;

    this.props.remove(taskType._id);
  };

  renderEditForm = props => {
    return <Form {...props} />;
  };

  renderEditAction = () => {
    const { taskType, renderButton } = this.props;

    const editTrigger = (
      <Button btnStyle="link">
        <Tip text={__('Edit')}>
          <Icon icon="edit" />
        </Tip>
      </Button>
    );

    const content = props => (
      <Form {...props} taskType={taskType} renderButton={renderButton} />
    );

    return (
      <ModalTrigger title="Edit" trigger={editTrigger} content={content} />
    );
  };

  render() {
    const { taskType } = this.props;

    return (
      <tr>
        <td style={{ textAlign: 'center' }}>
          <Icon icon={taskType.icon} size={16} />
        </td>
        <td>{taskType.name}</td>

        <td>
          <ActionButtons>
            {this.renderEditAction()}

            <Tip text={__('Delete')}>
              <Button btnStyle="link" onClick={this.remove} icon="cancel-1" />
            </Tip>
          </ActionButtons>
        </td>
      </tr>
    );
  }
}

export default Row;
