import CustomFieldsSection from 'modules/cars/containers/detail/CustomFieldsSection';
import { ICar } from 'modules/cars/types';
import TaggerSection from 'modules/customers/components/common/TaggerSection';
import Sidebar from 'modules/layout/components/Sidebar';
import React from 'react';
import BasicInfoSection from '../common/BasicInfoSection';

type Props = {
  car: ICar;
  taggerRefetchQueries?: any[];
};

class LeftSidebar extends React.Component<Props> {
  render() {
    const { car, taggerRefetchQueries } = this.props;

    return (
      <Sidebar wide={true}>
        <BasicInfoSection car={car} />
        <CustomFieldsSection car={car} />
        <TaggerSection
          data={car}
          type="car"
          refetchQueries={taggerRefetchQueries}
        />
      </Sidebar>
    );
  }
}

export default LeftSidebar;
