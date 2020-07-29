import _ from 'lodash';
import FormControl from 'modules/common/components/form/Control';
import Tags from 'modules/common/components/Tags';
import { formatValue } from 'modules/common/utils';
import { ClickableRow } from 'modules/customers/styles';
import React from 'react';
import { FlexItem } from '../../styles';
import { ICar } from '../../types';

type Props = {
  car: ICar;
  columnsConfig: any[];
  history: any;
  isChecked: boolean;
  toggleBulk: (car: ICar, isChecked?: boolean) => void;
};

function displayObjectListItem(car, customFieldName, subFieldName) {
  const objectList = car[customFieldName] || [];
  const subFieldKey = subFieldName.replace(`${customFieldName}.`, '');

  const subField = objectList.find
    ? objectList.find(obj => obj.field === subFieldKey)
    : [];

  if (!subField) {
    return null;
  }

  return formatValue(subField.value);
}

function displayValue(car, name) {
  const value = _.get(car, name);

  if (name === 'primaryName') {
    return <FlexItem>{formatValue(car.primaryName)}</FlexItem>;
  }

  if (name.includes('customFieldsData')) {
    return displayObjectListItem(car, 'customFieldsData', name);
  }

  return formatValue(value);
}

function CarRow({ car, columnsConfig, history, isChecked, toggleBulk }: Props) {
  const tags = car.getTags || [];

  const onChange = e => {
    if (toggleBulk) {
      toggleBulk(car, e.target.checked);
    }
  };

  const onClick = e => {
    e.stopPropagation();
  };

  const onTrClick = () => {
    history.push(`/cars/details/${car._id}`);
  };

  return (
    <tr onClick={onTrClick}>
      <td onClick={onClick}>
        <FormControl
          checked={isChecked}
          componentClass="checkbox"
          onChange={onChange}
        />
      </td>
      {columnsConfig.map(({ name }) => (
        <td key={name}>
          <ClickableRow>{displayValue(car, name)}</ClickableRow>
        </td>
      ))}
      <td>
        <Tags tags={tags} limit={2} />
      </td>
    </tr>
  );
}

export default CarRow;
