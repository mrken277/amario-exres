import Button from 'modules/common/components/Button';
import FormGroup from 'modules/common/components/form/Group';
import ControlLabel from 'modules/common/components/form/Label';
import Icon from 'modules/common/components/Icon';
import Tip from 'modules/common/components/Tip';
import { __ } from 'modules/common/utils';
import { ITaskType } from 'modules/settings/taskType/types';
import React from 'react';
import { Link } from 'react-router-dom';
import { TaskTypes, TypeIcon } from '../styles';

type Props = {
  types: ITaskType[];
  currentType?: string;
  onChange: (name: any, value: string) => void;
};

export default class ChooseType extends React.Component<Props> {
  renderTaskType() {
    const { types, onChange, currentType } = this.props;

    if (types.length === 0) {
      return (
        <Link to="/settings/task-types">
          <Button btnStyle="primary" size="small" icon="add">
            {__('Create task type')}
          </Button>
        </Link>
      );
    }

    return types.map(type => (
      <Tip key={type._id} text={type.name} placement="bottom">
        <TypeIcon
          className={currentType === type._id ? 'active' : ''}
          onClick={onChange.bind(this, 'typeId', type._id)}
        >
          <Icon icon={type.icon} size={15} />
        </TypeIcon>
      </Tip>
    ));
  }

  render() {
    return (
      <FormGroup>
        <ControlLabel>Type</ControlLabel>
        <TaskTypes>{this.renderTaskType()}</TaskTypes>
      </FormGroup>
    );
  }
}
