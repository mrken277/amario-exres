import Datetime from '@nateradebaugh/react-datetime';
import BoardSelect from 'modules/boards/containers/BoardSelect';
import { FormFooter } from 'modules/boards/styles/item';
import { IItem, IOptions } from 'modules/boards/types';
import { invalidateCache } from 'modules/boards/utils';
import Button from 'modules/common/components/Button';
import FormControl from 'modules/common/components/form/Control';
import Form from 'modules/common/components/form/Form';
import FormGroup from 'modules/common/components/form/Group';
import ControlLabel from 'modules/common/components/form/Label';
import Icon from 'modules/common/components/Icon';
import { IFormProps } from 'modules/common/types';
import { __ } from 'modules/common/utils';
import { ITaskType } from 'modules/settings/taskType/types';
import SelectTeamMembers from 'modules/settings/team/containers/SelectTeamMembers';
import React from 'react';
import { Container, DateIcon, DueDate } from '../styles';
import { ITaskParams } from '../types';
import ChooseType from './ChooseType';

type Props = {
  options: IOptions;
  boardId?: string;
  pipelineId?: string;
  customerIds?: string[];
  companyIds?: string[];
  contentType?: string;
  contentId?: string;
  stageId?: string;
  saveItem: (doc: ITaskParams, callback: (item: IItem) => void) => void;
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

  onFinishClick = () => {
    const { isDone } = this.state;

    this.setState({ isDone: !isDone });
  };

  save = (values: any) => {
    const {
      saveItem,
      closeModal,
      callback,
      contentId,
      contentType,
      companyIds,
      customerIds
    } = this.props;

    const doc = {
      ...this.state,
      name: values.name,
      customerIds: customerIds || [],
      companyIds: companyIds || [],
      contentId: contentId || '',
      contentType: contentType || ''
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

  renderContent = (formProps: IFormProps) => {
    const userOnChange = usrs => this.onChangeField('assignedUserIds', usrs);
    const dateOnChange = date => this.onChangeField('closeDate', date);

    return (
      <Container>
        <ChooseType
          currentType={this.state.typeId}
          types={this.props.types}
          onChange={this.onChangeField}
        />

        <FormGroup>
          <ControlLabel required={true}>Name</ControlLabel>
          <FormControl
            {...formProps}
            name="name"
            autoFocus={true}
            required={true}
          />
        </FormGroup>

        {this.renderSelect()}

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
      </Container>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} onSubmit={this.save} />;
  }
}

export default TaskAddForm;
