import Datetime from '@nateradebaugh/react-datetime';
import BoardSelect from 'modules/boards/containers/BoardSelect';
import { AddContainer, FormFooter } from 'modules/boards/styles/item';
import { IItem, IItemParams, IOptions } from 'modules/boards/types';
import { invalidateCache } from 'modules/boards/utils';
import Button from 'modules/common/components/Button';
import FormControl from 'modules/common/components/form/Control';
import Form from 'modules/common/components/form/Form';
import FormGroup from 'modules/common/components/form/Group';
import ControlLabel from 'modules/common/components/form/Label';
import Icon from 'modules/common/components/Icon';
import Tip from 'modules/common/components/Tip';
import { IFormProps } from 'modules/common/types';
import { __ } from 'modules/common/utils';
import { ITaskType } from 'modules/settings/taskType/types';
import SelectTeamMembers from 'modules/settings/team/containers/SelectTeamMembers';
import React from 'react';
import { Link } from 'react-router-dom';
import { DateIcon, DueDate, TaskTypes, TypeIcon } from '../styles';

type Props = {
  options: IOptions;
  boardId?: string;
  pipelineId?: string;
  stageId?: string;
  saveItem: (doc: IItemParams, callback: (item: IItem) => void) => void;
  showSelect?: boolean;
  closeModal: () => void;
  callback?: (item?: IItem) => void;
  types: ITaskType[];
};

type State = {
  stageId: string;
  disabled: boolean;
  boardId: string;
  pipelineId: string;
  typeId?: string;
  closeDate?: Date;
  assignedUserIds?: string[];
  isDone: boolean;
};

class TaskAddForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      disabled: false,
      isDone: false,
      stageId: props.stageId || '',
      boardId: '',
      pipelineId: ''
    };
  }

  onChangeField = <T extends keyof State>(name: T, value: State[T]) => {
    this.setState({ [name]: value } as Pick<State, keyof State>);
  };

  onTypeClick = (id: string) => {
    this.setState({ typeId: id });
  };

  onFinishClick = () => {
    const { isDone } = this.state;

    this.setState({ isDone: !isDone });
  };

  save = (values: any) => {
    const { stageId, closeDate, typeId, assignedUserIds, isDone } = this.state;
    const { saveItem, closeModal, callback } = this.props;

    const doc = {
      name: values.name,
      stageId,
      closeDate,
      typeId,
      assignedUserIds,
      isDone
    };

    // before save, disable save button
    this.setState({ disabled: true });

    saveItem(doc, (item: IItem) => {
      // after save, enable save button
      this.setState({ disabled: false });

      closeModal();

      if (callback) {
        callback(item);
      }

      invalidateCache();
    });
  };

  renderSelect() {
    const { showSelect, options } = this.props;

    if (!showSelect) {
      return null;
    }

    const { stageId, pipelineId, boardId } = this.state;

    const stgIdOnChange = stgId => this.onChangeField('stageId', stgId);
    const plIdOnChange = plId => this.onChangeField('pipelineId', plId);
    const brIdOnChange = brId => this.onChangeField('boardId', brId);

    return (
      <BoardSelect
        type={options.type}
        stageId={stageId}
        pipelineId={pipelineId}
        boardId={boardId}
        onChangeStage={stgIdOnChange}
        onChangePipeline={plIdOnChange}
        onChangeBoard={brIdOnChange}
      />
    );
  }

  renderTaskType() {
    const { types } = this.props;

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
          className={this.state.typeId === type._id ? 'active' : ''}
          onClick={this.onTypeClick.bind(this, type._id)}
        >
          <Icon icon={type.icon} size={15} />
        </TypeIcon>
      </Tip>
    ));
  }

  renderContent = (formProps: IFormProps) => {
    const dateOnChange = date => this.onChangeField('closeDate', date);
    const userOnChange = usrs => this.onChangeField('assignedUserIds', usrs);

    return (
      <AddContainer>
        {this.renderSelect()}

        <div>
          <FormGroup>
            <ControlLabel>Task type</ControlLabel>
            <TaskTypes>{this.renderTaskType()}</TaskTypes>
          </FormGroup>
          <FormGroup>
            <ControlLabel required={true}>Name</ControlLabel>
            <FormControl
              {...formProps}
              name="name"
              autoFocus={true}
              required={true}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Close date</ControlLabel>
            <DueDate>
              <Datetime
                inputProps={{ placeholder: 'Click to select a date' }}
                dateFormat="YYYY/MM/DD"
                timeFormat={false}
                closeOnSelect={true}
                value={this.state.closeDate}
                onChange={dateOnChange}
                utc={true}
              />
              <DateIcon>
                <Icon icon="calendar" size={15} />
              </DateIcon>
            </DueDate>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Assigned to</ControlLabel>
            <SelectTeamMembers
              label="Choose users"
              name="assignedUserIds"
              value={this.state.assignedUserIds}
              onSelect={userOnChange}
              filterParams={{ status: 'verified' }}
            />
          </FormGroup>
          <FormGroup>
            <FormControl
              id="isDone"
              componentClass="checkbox"
              onClick={this.onFinishClick}
            >
              {__('Finished')}
            </FormControl>
          </FormGroup>
        </div>

        <FormFooter>
          <Button
            btnStyle="simple"
            onClick={this.props.closeModal}
            icon="cancel-1"
          >
            Close
          </Button>

          <Button
            disabled={this.state.disabled}
            btnStyle="success"
            icon="checked-1"
            type="submit"
          >
            Save
          </Button>
        </FormFooter>
      </AddContainer>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} onSubmit={this.save} />;
  }
}

export default TaskAddForm;
