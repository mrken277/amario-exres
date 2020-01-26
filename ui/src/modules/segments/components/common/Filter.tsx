import Button from "modules/common/components/Button";
import { FormControl } from "modules/common/components/form";
import { __ } from "modules/common/utils";
import { operators } from "modules/customers/constants";
import { FlexContent, FlexItem, FlexRightItem } from "modules/layout/styles";
import React from "react";
import { IConditionFilter } from "../../types";

type Props = {
  names: string[];
  filter: IConditionFilter;
  onChange: (filter: IConditionFilter) => void;
  onRemove?: (id: string) => void;
};

type State = {
  key: string;
  currentName: string;
  currentOperator: string;
  currentValue: string;
};

class Filter extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const { filter } = this.props;

    this.state = {
      key: filter.key || '',
      currentName: filter.name,
      currentOperator: filter.operator,
      currentValue: filter.value,
    };
  }

  onChange = () => {
    const { currentName, currentOperator, currentValue } = this.state;
    const { onChange, filter } = this.props;

    return onChange({
      key: filter.key,
      name: currentName,
      operator: currentOperator,
      value: currentValue,
    });
  }

  onChangeValue = (e: React.FormEvent<HTMLElement>) => {
    this.setState({ currentValue: (e.currentTarget as HTMLInputElement).value }, this.onChange);
  }

  onChangeNames = (e: React.FormEvent<HTMLElement>) => {
    this.setState({ currentName: (e.currentTarget as HTMLInputElement).value }, this.onChange);
  }

  onChangeOperators = (e: React.FormEvent<HTMLElement>) => {
    this.setState({ currentOperator: (e.currentTarget as HTMLInputElement).value }, this.onChange);
  }

  renderNames() {
    const { names } = this.props;
    const { currentName } = this.state;

    return (
      <FormControl componentClass="select" placeholder={__("select")} onChange={this.onChangeNames} value={currentName}>
        <option />
        {names.map((name, index) => (
          <option value={name} key={index}>
            {name}
          </option>
        ))}
      </FormControl>
    );
  }

  renderOperators() {
    const { currentOperator } = this.state;

    return (
      <FormControl componentClass="select" placeholder={__("select")} onChange={this.onChangeOperators} value={currentOperator}>
        <option />
        {operators.map(c => (
          <option value={c.value} key={c.value}>
            {c.name}
          </option>
        ))}
      </FormControl>
    );
  }

  onRemove = () => {
    const { onRemove } = this.props;

    if (onRemove) {
      onRemove(this.props.filter.key || '');
    }
  };

  renderRemoveButton = () => {
    const { onRemove } = this.props;

    if (!onRemove) {
      return;
    }

    return <Button btnStyle="danger" size="small" icon="cancel-1" onClick={this.onRemove} />;
  }

  render() {
    const { currentValue } = this.state;

    return (
      <FlexContent>
        <FlexItem>
          {this.renderNames()}
          {this.renderOperators()}
          <input value={currentValue} onChange={this.onChangeValue} />
        </FlexItem>
        <FlexRightItem>
          {this.renderRemoveButton()}
        </FlexRightItem>
      </FlexContent>
    );
  }
}

export default Filter;
