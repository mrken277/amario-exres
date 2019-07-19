import Button from 'modules/common/components/Button';
import FormControl from 'modules/common/components/form/Control';
import CommonForm from 'modules/common/components/form/Form';
import FormGroup from 'modules/common/components/form/Group';
import ControlLabel from 'modules/common/components/form/Label';
import Icon from 'modules/common/components/Icon';
import { IButtonMutateProps, IFormProps } from 'modules/common/types';
import React from 'react';
import { Modal } from 'react-bootstrap';
import Select from 'react-select-plus';
import { TASK_ICONS } from '../constants';
import { ITaskType } from '../types';

type Props = {
  taskType?: ITaskType;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
};

type State = {
  selectedIcon: string;
};

class Form extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedIcon: this.getSelectedIcon()
    };
  }

  onChangeIcon = obj => {
    this.setState({
      selectedIcon: obj ? obj.value : ''
    });
  };

  getSelectedIcon() {
    const { taskType } = this.props;

    return taskType ? taskType.icon : '';
  }

  renderOption = option => {
    return (
      <div className="icon-option">
        <Icon icon={option.value} />
        {option.label}
      </div>
    );
  };

  generateDoc = (values: { _id?: string; name: string }) => {
    const { taskType } = this.props;

    if (taskType) {
      values._id = taskType._id;
    }

    return {
      _id: values._id,
      name: values.name,
      icon: this.state.selectedIcon
    };
  };

  renderContent = (formProps: IFormProps) => {
    const { renderButton, closeModal, taskType } = this.props;
    const { values, isSubmitted } = formProps;
    const object = taskType || ({} as ITaskType);

    return (
      <>
        <FormGroup>
          <ControlLabel required={true}>Name</ControlLabel>
          <FormControl
            {...formProps}
            name="name"
            defaultValue={object.name}
            autoFocus={true}
            required={true}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel required={true}>Icon</ControlLabel>
          <Select
            isRequired={true}
            value={this.state.selectedIcon}
            options={TASK_ICONS}
            onChange={this.onChangeIcon}
            optionRenderer={this.renderOption}
            valueRenderer={this.renderOption}
          />
        </FormGroup>

        <Modal.Footer>
          <Button btnStyle="simple" onClick={closeModal} icon="cancel-1">
            Close
          </Button>

          {renderButton({
            name: 'task type',
            values: this.generateDoc(values),
            isSubmitted,
            callback: closeModal,
            object: taskType
          })}
        </Modal.Footer>
      </>
    );
  };

  render() {
    return <CommonForm renderContent={this.renderContent} />;
  }
}

export default Form;
