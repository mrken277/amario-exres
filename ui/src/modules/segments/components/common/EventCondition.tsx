import Button from 'modules/common/components/Button';
import { FormControl } from 'modules/common/components/form';
import { __ } from 'modules/common/utils';
import { FlexRightItem } from 'modules/layout/styles';
import React from 'react';
import { IConditionFilter, IEvent } from '../../types';
import { ConditionItem, FilterProperty, FilterRow, SubProperties } from '../styles';
import Filter from './Filter';

type Props = {
  events: IEvent[];
  conditionKey: string;
  name: string;
  attributeFilters: IConditionFilter[];
  onChange: (args: { key: string, name: string, attributeFilters: IConditionFilter[] }) => void;
  onRemove: (id: string) => void;
};

type State = {
  attributeFilters: IConditionFilter[];
  currentEventName?: string;
}

class Condition extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentEventName: props.name,
      attributeFilters: props.attributeFilters.map(filter => ({ key: Math.random().toString(), ...filter }))
    }
  }

  removeCondition = () => {
    this.props.onRemove(this.props.conditionKey);
  };

  onChangeFilter = () => {
    const { onChange, conditionKey } = this.props;
    const { currentEventName, attributeFilters } = this.state;

    return onChange({
      key: conditionKey,
      name: currentEventName || '',
      attributeFilters,
    });
  }

  onChangeAttributeFilter = (filter: IConditionFilter) => {
    this.setState({
      attributeFilters: this.state.attributeFilters.map(f =>
        f.key === filter.key ? filter : f
      )
    }, this.onChangeFilter);
  };

  onRemoveAttributeFilter = (key: string) => {
    const attributeFilters = this.state.attributeFilters.filter(f => f.key !== key);

    this.setState({ attributeFilters }, this.onChangeFilter);
  };

  onChangeEvents = (e) => {
    this.setState({ currentEventName: e.currentTarget.value }, this.onChangeFilter);
  }

  addAttributeFilter = () => {
    const attributeFilter = {
      key: Math.random().toString(),
      name: '',
      operator: '',
      value: ''
    };

    const { attributeFilters } = this.state;

    attributeFilters.push(attributeFilter);

    this.setState({ attributeFilters });
  }

  renderAttributeFilters = () => {
    const { attributeFilters, currentEventName } = this.state;
    const { events } = this.props;
    const currentEvent = events.find(e => e.name === currentEventName);
    
    if (!currentEvent) {
      return;
    }
    
    const nameFields = currentEvent.attributeNames.map(name => ({ value: name, label: name }));
    
    return attributeFilters.map((filter, index) => {
      return (
        <Filter
          key={index}
          fields={nameFields}
          filter={filter}
          onChange={this.onChangeAttributeFilter}
          onRemove={this.onRemoveAttributeFilter}
        />
      );
    });
  }

  renderNames() {
    const { events } = this.props;
    const { currentEventName } = this.state;

    return (
      <FormControl componentClass="select" placeholder={__("select")} onChange={this.onChangeEvents} value={currentEventName}>
        <option value="">{__('Select event')}...</option>

        {events.map((event, index) => (
          <option value={event.name} key={index}>
            {event.name}
          </option>
        ))}
      </FormControl>
    );
  }

  render() {
    return (
      <>
        <ConditionItem>
          <FilterRow>
            <FilterProperty>
              {this.renderNames()}
            </FilterProperty>
            <FilterProperty>
              {
                this.state.currentEventName && 
                <Button 
                  btnStyle="simple"
                  icon="plus-circle" 
                  uppercase={false} 
                  onClick={this.addAttributeFilter}
                >
                  Add event attribute
                </Button>
              }
            </FilterProperty>
            <FlexRightItem>
              <Button
                className="round"
                btnStyle="danger"
                uppercase={false}
                icon="times"
                onClick={this.removeCondition}
              />
            </FlexRightItem>
          </FilterRow>
        </ConditionItem>
        <SubProperties>
          {this.renderAttributeFilters()}
        </SubProperties>
      </>
    );
  }
}

export default Condition;
