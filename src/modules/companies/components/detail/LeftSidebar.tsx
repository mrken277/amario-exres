import Box from 'modules/common/components/Box';
import { __ } from 'modules/common/utils';
import BasicInfo from 'modules/companies/containers/detail/BasicInfo';
import CustomFieldsSection from 'modules/companies/containers/detail/CustomFieldsSection';
import { ICompany } from 'modules/companies/types';
import TaggerSection from 'modules/customers/components/common/TaggerSection';
import Sidebar from 'modules/layout/components/Sidebar';
import React from 'react';

type Props = {
  company: ICompany;
  taggerRefetchQueries?: any[];
  toggleSection: (params: { name: string; isOpen: boolean }) => void;
  config: { [key: string]: boolean };
};

class LeftSidebar extends React.Component<Props> {
  render() {
    const { company, taggerRefetchQueries, config, toggleSection } = this.props;

    return (
      <Sidebar wide={true}>
        <BasicInfo company={company} />
        <Box
          title={__('Contact Information')}
          name="showContactInformation"
          isOpen={config.showContactInformation || false}
          toggle={toggleSection}
        >
          <CustomFieldsSection company={company} />
        </Box>
        <Box
          title={__('Tags')}
          name="showTags"
          isOpen={config.showTags || false}
          toggle={toggleSection}
        >
          <TaggerSection
            data={company}
            type="company"
            refetchQueries={taggerRefetchQueries}
            isOpen={config.showTags || false}
          />
        </Box>
      </Sidebar>
    );
  }
}

export default LeftSidebar;
