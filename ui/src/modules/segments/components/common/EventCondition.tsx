import Button from 'modules/common/components/Button';
import { FormControl } from 'modules/common/components/form';
import { __ } from 'modules/common/utils';
import { FlexContent, FlexItem, FlexRightItem } from 'modules/layout/styles';
import React from 'react';
import { IConditionFilter } from '../../types';
import { ConditionItem } from '../styles';
import Filter from './Filter';

type Props = {
  events: any[];
  conditionKey: string;
  name: string;
  attributeFilters: IConditionFilter[];
  onChange: (args: { key: string, name: string, attributeFilters: IConditionFilter[] }) => void;
  onRemove: (id: string) => void;
};

type State = {
  attributeFilters: IConditionFilter[];
  currentEvent?: string;
}

class Condition extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentEvent: props.name,
      attributeFilters: props.attributeFilters.map(filter => ({...filter }))
    }
  }

  removeCondition = () => {
    this.props.onRemove(this.props.conditionKey);
  };

  onChangeFilter = () => {
    const { onChange, conditionKey } = this.props;
    const { currentEvent, attributeFilters } = this.state;

    return onChange({
      key: conditionKey,
      name: currentEvent || '',
      attributeFilters,
    });
  }

  onChangeEvents = (e) => {
    this.setState({ currentEvent: e.currentTarget.value }, this.onChangeFilter);
  }

  renderAttributeFilters = () => {
    const { attributeFilters, events } = this.props;

    return attributeFilters.map(filter => {
      return <Filter key={filter.key} names={events} filter={filter} onChange={this.onChangeFilter} />;
    });
  }

  renderNames() {
    const { events } = this.props;
    const { currentEvent } = this.state;

    return (
      <FormControl componentClass="select" placeholder={__("select")} onChange={this.onChangeEvents} value={currentEvent}>
        <option />

        {events.map((name, index) => (
          <option value={name} key={index}>
            {name}
          </option>
        ))}
      </FormControl>
    );
  }

  render() {
    return (
      <ConditionItem>
        <FlexContent>
          <FlexItem>
            {this.renderNames()}
          </FlexItem>
          <FlexRightItem>
            <Button
              btnStyle="danger"
              size="small"
              icon="cancel-1"
              onClick={this.removeCondition}
            />
          </FlexRightItem>
        </FlexContent>
      </ConditionItem>
    );
  }
}

export default Condition;
