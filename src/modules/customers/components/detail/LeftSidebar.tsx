import Box from 'modules/common/components/Box';
import { __ } from 'modules/common/utils';
import BasicInfoSection from 'modules/customers/components/common/BasicInfoSection';
import CustomFieldsSection from 'modules/customers/containers/common/CustomFieldsSection';
import Sidebar from 'modules/layout/components/Sidebar';
import React from 'react';

import { ICustomer } from 'modules/customers/types';
import {
  DevicePropertiesSection,
  MessengerSection,
  TaggerSection
} from '../common';

type Props = {
  customer: ICustomer;
  taggerRefetchQueries?: any[];
  wide?: boolean;
  toggleSection: (params: { name: string; isOpen: boolean }) => void;
  config: { [key: string]: boolean };
};

export default class LeftSidebar extends React.Component<Props> {
  render() {
    const {
      customer,
      wide,
      taggerRefetchQueries,
      config,
      toggleSection
    } = this.props;

    return (
      <Sidebar wide={wide}>
        <BasicInfoSection customer={customer} />
        <Box
          title={__('Contact Information')}
          name="showContactInformation"
          isOpen={config.showContactInformation || false}
          toggle={toggleSection}
        >
          <CustomFieldsSection customer={customer} />
        </Box>
        <Box
          title={__('Device properties')}
          name="showDeviceProperties"
          isOpen={config.showDeviceProperties || false}
          toggle={toggleSection}
        >
          <DevicePropertiesSection customer={customer} />
        </Box>
        <Box
          title={__('Messenger data')}
          name="showMessengerData"
          isOpen={config.showMessengerData || false}
          toggle={toggleSection}
        >
          <MessengerSection customer={customer} />
        </Box>
        <Box
          title={__('Tags')}
          name="showTags"
          isOpen={config.showTags || false}
          toggle={toggleSection}
        >
          <TaggerSection
            data={customer}
            type="customer"
            refetchQueries={taggerRefetchQueries}
          />
        </Box>
      </Sidebar>
    );
  }
}
