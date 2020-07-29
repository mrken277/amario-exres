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
        {this.renderRow('Code', car.code)}
        {this.renderRow('Size', car.size)}
        {this.renderRow('Industry', car.industry)}
        {this.renderRow('Email', car.primaryEmail)}
        {this.renderRow(
          'Owner',
          car.owner && car.owner.details ? car.owner.details.fullName : '-'
        )}
        {this.renderRow('Phone', car.primaryPhone)}
        {this.renderRow('Business Type', car.businessType)}
        {this.renderRow('Do not disturb', car.doNotDisturb)}
        <SidebarFlexRow>
          {__(`Description`)}:<span>{car.description || '-'}</span>
        </SidebarFlexRow>
      </SidebarList>
    );
  }
}

export default DetailInfo;
