import Button from 'modules/common/components/Button';
import { FlexContent, FlexItem, FlexRightItem } from 'modules/layout/styles';
import React from 'react';
import { IConditionFilter, ISegmentCondition } from '../../types';
import { ConditionItem } from '../styles';
import Filter from './Filter';

type Props = {
  fields: any[];
  condition: ISegmentCondition;
  changeCondition: (condition: ISegmentCondition) => void;
  removeCondition: (id: string) => void;
};

class Condition extends React.Component<Props, {}> {
  removeCondition = () => {
    this.props.removeCondition(this.props.condition.key);
  };

  onChangeFilter = (filter: IConditionFilter) => {
    const { changeCondition, condition } = this.props;

    return changeCondition({
      key: condition.key,
      type: 'property',
      propertyName: filter.name,
      propertyOperator: filter.operator,
      propertyValue: filter.value
    });
  }

  render() {
    const { fields, condition } = this.props;
    const names = fields.map(field => field.name);

    const filter = {
      key: condition.key,
      name: condition.propertyName || '',
      operator: condition.propertyOperator || '',
      value: condition.propertyValue || ''
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
