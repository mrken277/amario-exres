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
import { IFormProps } from 'modules/common/types';
import { Alert } from 'modules/common/utils';
import React from 'react';
import Select from 'react-select-plus';
import Toggle from 'react-toggle';

type Props = {
  options: IOptions;
  customerIds?: string[];
  companyIds?: string[];
  boardId?: string;
  pipelineId?: string;
  stageId?: string;
  saveItem: (doc: IItemParams, callback: (item: IItem) => void) => void;
  showSelect?: boolean;
  closeModal: () => void;
  callback?: (item?: IItem) => void;
};

type State = {
  stageId: string;
  name: string;
  disabled: boolean;
  boardId: string;
  pipelineId: string;
};

class TaskForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      disabled: false,
      boardId: '',
      pipelineId: '',
      stageId: props.stageId || '',
      name: ''
    };
  }

  onChangeField = <T extends keyof State>(name: T, value: State[T]) => {
    this.setState({ [name]: value } as Pick<State, keyof State>);
  };

  save = (values: any) => {
    const { stageId } = this.state;
    const {
      companyIds,
      customerIds,
      saveItem,
      closeModal,
      callback
    } = this.props;

    // if (!stageId) {
    //   return Alert.error('No stage');
    // }

    // if (!name) {
    //   return Alert.error('Enter name');
    // }

    const doc = {
      name: values.name,
      stageId,
      customerIds: customerIds || [],
      companyIds: companyIds || []
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
    return (
      <AddContainer>
        {this.renderSelect()}

        <div>
          <FormGroup>
            <ControlLabel>Task type</ControlLabel>
            <FormControl componentClass="select">
              <option value="email">Email</option>
              <option value="messenger">Messenger</option>
            </FormControl>
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
            <Datetime
              inputProps={{ placeholder: 'Click to select a date' }}
              dateFormat="YYYY/MM/DD"
              timeFormat={false}
              closeOnSelect={true}
              utc={true}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Deal</ControlLabel>
            <FormControl componentClass="select">
              <option value="email">Email</option>
              <option value="messenger">Messenger</option>
            </FormControl>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Companies</ControlLabel>
            <Select removeSelected={false} multi={true}>
              <option value="email">Email</option>
              <option value="messenger">Messenger</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Customers</ControlLabel>
            <Select removeSelected={false} multi={true}>
              <option value="email">Email</option>
              <option value="messenger">Messenger</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Assigned to</ControlLabel>
            <FormControl componentClass="select">
              <option value="email">Email</option>
              <option value="messenger">Messenger</option>
            </FormControl>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Finished</ControlLabel>
            <div>
              <Toggle
                checked={false}
                icons={{
                  checked: <span>Yes</span>,
                  unchecked: <span>No</span>
                }}
              />
            </div>
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

export default TaskForm;
