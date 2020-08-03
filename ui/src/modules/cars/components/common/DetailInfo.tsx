import { __ } from 'modules/common/utils';
import {
  FieldStyle,
  SidebarCounter,
  SidebarFlexRow,
  SidebarList
} from 'modules/layout/styles';
import React from 'react';
import { ICar } from '../../types';

type Props = {
  car: ICar;
};

class DetailInfo extends React.Component<Props> {
  renderRow = (label, value) => {
    return (
      <li>
        <FieldStyle>{__(`${label}`)}</FieldStyle>
        <SidebarCounter>{value || '-'}</SidebarCounter>
      </li>
    );
  };

  render() {
    const { car } = this.props;

    return (
      <SidebarList className="no-link">
        {this.renderRow('Plate number', car.plateNumber)}
        {this.renderRow('VIN number', car.vinNumber)}
        {this.renderRow('Model', car.modelsName)}
        {this.renderRow('Brand', car.manufactureBrand)}
        {this.renderRow(
          'Owner',
          car.owner && car.owner.details ? car.owner.details.fullName : '-'
        )}
        {this.renderRow('Series', car.series)}
        <SidebarFlexRow>
          {__(`Description`)}:<span>{car.description || '-'}</span>
        </SidebarFlexRow>
      </SidebarList>
    );
  }
}

export default DetailInfo;
