import Button from 'modules/common/components/Button';
import FormControl from 'modules/common/components/form/Control';
import CommonForm from 'modules/common/components/form/Form';
import FormGroup from 'modules/common/components/form/Group';
import ControlLabel from 'modules/common/components/form/Label';
import { IButtonMutateProps, IFormProps } from 'modules/common/types';
import { __, generateRandomColorCode } from 'modules/common/utils';
import { FlexContent, FlexItem } from 'modules/layout/styles';
import {
  ISegment,
  ISegmentCondition,
  ISegmentConditionDoc,
  ISegmentDoc,
  ISegmentField,
  ISegmentWithConditionDoc
} from 'modules/segments/types';
import React from 'react';
import { Link } from 'react-router-dom';
import { ConditionWrapper, SegmentTitle, SegmentWrapper } from '../styles';
import AddConditionButton from './AddConditionButton';
import Conditions from './Conditions';

type Props = {
  contentType?: string;
  fields: ISegmentField[];
  events: string[];
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  edit?: (params: { _id: string; doc: ISegmentWithConditionDoc }) => void;
  segment?: ISegment;
  headSegments: ISegment[];
  count: (segment: ISegmentDoc) => void;
  isForm?: boolean;
  afterSave?: () => void;
};

type State = {
  name: string;
  description: string;
  subOf: string;
  color: string;
  conditions: ISegmentCondition[];
  connector: string;
};

class Form extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const segment: ISegment = props.segment || {
      name: '',
      type: 'properties',
      description: '',
      subOf: '',
      color: generateRandomColorCode(),
      conditions: [],
      connector: 'any'
    };

    segment.conditions = segment.conditions.map(
      (cond: ISegmentConditionDoc) => ({
        key: Math.random().toString(),
        ...cond
      })
    );

    this.state = segment;
  }

  addCondition = (condition: ISegmentCondition) => {
    this.setState({
      conditions: [...this.state.conditions, condition]
    });
  };

  changeCondition = (condition: ISegmentCondition) => {
    this.setState({
      conditions: this.state.conditions.map(c =>
        c.key === condition.key ? condition : c
      )
    });
  };

  removeCondition = (key: string) => {
    const conditions = this.state.conditions.filter(c => c.key !== key);

    this.setState({ conditions });
  };

  handleChange = <T extends keyof State>(name: T, value: State[T]) => {
    this.setState({ [name]: value } as Pick<State, keyof State>);
  };

  generateDoc = (values: {
    _id?: string;
    name: string;
    subOf: string;
    color: string;
  }) => {
    const { segment, contentType } = this.props;
    const { connector, conditions } = this.state;
    const finalValues = values;

    const updatedConditions: ISegmentConditionDoc[] = [];

    if (segment) {
      finalValues._id = segment._id;
    }

    conditions.forEach((cond: ISegmentCondition) => {
      if (cond.propertyOperator) {
        const { key, ...rest } = cond;
        updatedConditions.push(rest);
      }
    });

    return {
      ...finalValues,
      contentType,
      connector,
      conditions: updatedConditions
    };
  };

  renderConditions() {
    const { contentType, fields, events } = this.props;
    const { conditions, connector, subOf } = this.state;

    const connectorOnChange = (e: React.FormEvent) =>
      this.handleChange(
        'connector',
        (e.currentTarget as HTMLInputElement).value
      );

    return (
      <React.Fragment>
        <ConditionWrapper>
          <FormGroup>
            {__('Users who match')}
            <FormControl
              componentClass="select"
              value={connector}
              onChange={connectorOnChange}
            >
              <option value="any">{__('any')}</option>
              <option value="all">{__('all')}</option>
            </FormControl>
            {__('of the below conditions')}
          </FormGroup>

          <Conditions
            contentType={contentType}
            fields={fields}
            parentSegmentId={subOf}
            conditions={conditions}
            changeCondition={this.changeCondition}
            removeCondition={this.removeCondition}
          />
        </ConditionWrapper>

        <AddConditionButton fields={fields} events={events} addCondition={this.addCondition} />
      </React.Fragment>
    );
  }

  renderSubOf(formProps: IFormProps) {
    const onChange = (e: React.FormEvent) =>
      this.handleChange('subOf', (e.currentTarget as HTMLInputElement).value);

    return (
      <FormGroup>
        <ControlLabel>Sub segment of</ControlLabel>
        <FormControl
          {...formProps}
          name="subOf"
          componentClass="select"
          value={this.state.subOf || ''}
          onChange={onChange}
        >
          <option value="">[not selected]</option>
          {this.props.headSegments.map(segment => (
            <option value={segment._id} key={segment._id}>
              {segment.name}
            </option>
          ))}
        </FormControl>
      </FormGroup>
    );
  }

  renderForm = (formProps: IFormProps) => {
    const {
      isForm,
      segment,
      contentType,
      renderButton,
      afterSave
    } = this.props;

    const { values, isSubmitted } = formProps;
    const { name, description, color } = this.state;

    const nameOnChange = (e: React.FormEvent) =>
      this.handleChange('name', (e.currentTarget as HTMLInputElement).value);

    const descOnChange = (e: React.FormEvent) =>
      this.handleChange(
        'description',
        (e.currentTarget as HTMLInputElement).value
      );

    const colorOnChange = (e: React.FormEvent) =>
      this.handleChange('color', (e.currentTarget as HTMLInputElement).value);

    return (
      <>
        <FormGroup>
          <ControlLabel required={true}>Name</ControlLabel>
          <FormControl
            {...formProps}
            name="name"
            value={name}
            onChange={nameOnChange}
            required={true}
            autoFocus={true}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Description</ControlLabel>
          <FormControl
            {...formProps}
            name="description"
            value={description}
            onChange={descOnChange}
          />
        </FormGroup>
        {this.renderSubOf({ ...formProps })}
        <FormGroup>
          <ControlLabel>Color</ControlLabel>
          <FormControl
            {...formProps}
            name="color"
            type="color"
            value={color}
            onChange={colorOnChange}
          />
        </FormGroup>
        <Button.Group>
          {isForm && (
            <Link to={`/segments/${contentType}`}>
              <Button size="small" btnStyle="simple" icon="cancel-1">
                Cancel
              </Button>
            </Link>
          )}

          {renderButton({
            name: 'segment',
            values: this.generateDoc(values),
            callback: afterSave,
            isSubmitted,
            object: segment
          })}
        </Button.Group>
      </>
    );
  };

  render() {
    return (
      <SegmentWrapper>
        <SegmentTitle>{__('Filters')}</SegmentTitle>
        {this.renderConditions()}
        <hr />
        <FlexContent>
          <FlexItem count={4}>
            <CommonForm renderContent={this.renderForm} />
          </FlexItem>
          <FlexItem count={2} />
        </FlexContent>
      </SegmentWrapper>
    );
  }
}

export default Form;
