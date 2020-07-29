import Sidebar from 'modules/layout/components/Sidebar';
import React from 'react';
import { ICar } from '../../types';
import DetailInfo from './DetailInfo';

type Props = {
  car: ICar;
};

class BasicInfoSection extends React.Component<Props> {
  render() {
    const { Section } = Sidebar;
    const { car } = this.props;

    return (
      <Section>
        <DetailInfo car={car} />
      </Section>
    );
  }
}

export default BasicInfoSection;
