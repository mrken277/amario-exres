import Button from 'modules/common/components/Button';
import { FlexContent, FlexItem, FlexRightItem } from 'modules/layout/styles';
import React from 'react';
import { IConditionFilter } from '../../types';
import { ConditionItem } from '../styles';
import Filter from './Filter';

type Props = {
  fields: any[];
  conditionKey: string;
  name: string,
  operator: string,
  value: string,
  onChange: (args: { key: string, name: string, operator: string, value: string }) => void;
  onRemove: (id: string) => void;
};

class Condition extends React.Component<Props, {}> {
  removeCondition = () => {
    this.props.onRemove(this.props.conditionKey);
  };

  onChangeFilter = (filter: IConditionFilter) => {
    const { onChange, conditionKey } = this.props;

    return onChange({
      key: conditionKey,
      name: filter.name,
      operator: filter.operator,
      value: filter.value
    });
  }

  render() {
    const { fields, conditionKey, name, operator, value } = this.props;
    const names = fields.map(field => field.name);

    const filter = {
      key: conditionKey,
      name,
      operator,
      value
    }

    return (
      <ConditionItem>
        <FlexContent>
          <FlexItem>
            <Filter names={names} filter={filter} onChange={this.onChangeFilter} />
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
