import Button from 'modules/common/components/Button';
import { FormControl } from 'modules/common/components/form';
import { __ } from 'modules/common/utils';
import { FlexContent, FlexItem, FlexRightItem } from 'modules/layout/styles';
import React from 'react';
import { IConditionFilter } from '../../types';
import { ConditionItem } from '../styles';
import Filter from './Filter';

type Props = {
  events: string[];
  conditionKey: string;
  name: string;
  attributeNames: string[];
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
      attributeFilters: props.attributeFilters.map(filter => ({ key: Math.random().toString(), ...filter }))
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
    this.setState({ currentEvent: e.currentTarget.value }, this.onChangeFilter);
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
    const { attributeFilters } = this.state;
    const { attributeNames } = this.props;

    return attributeFilters.map((filter, index) => {
      return (
        <Filter
          key={index}
          names={attributeNames}
          filter={filter}
          onChange={this.onChangeAttributeFilter}
          onRemove={this.onRemoveAttributeFilter}
        />
      );
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

            <div>
              {this.renderAttributeFilters()}
            </div>

            <div>
              <Button onClick={this.addAttributeFilter}>
                Add attribute
              </Button>
            </div>
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
