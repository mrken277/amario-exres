import ActivityInputs from 'modules/activityLogs/components/ActivityInputs';
import ActivityLogs from 'modules/activityLogs/containers/ActivityLogs';
import { IUser } from 'modules/auth/types';
import { __ } from 'modules/common/utils';
import { ICompany } from 'modules/companies/types';
import { getConfig, setConfig } from 'modules/inbox/utils';
import Wrapper from 'modules/layout/components/Wrapper';
import React from 'react';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
type Props = {
  company: ICompany;
  currentUser: IUser;
  taggerRefetchQueries?: any[];
};

const STORAGE_KEY = `erxes_sidebar_section_config`;

class CompanyDetails extends React.Component<Props> {
  toggleSection = ({ name, isOpen }: { name: string; isOpen: boolean }) => {
    // const customerId = this.props.conversation.customerId;
    const config = getConfig(STORAGE_KEY);

    config[name] = isOpen;

    setConfig(STORAGE_KEY, config);

    // this.getCustomerDetail(customerId);
  };

  render() {
    const { company, taggerRefetchQueries } = this.props;

    const title = company.primaryName || 'Unknown';

    const breadcrumb = [
      { title: __('Contacts'), link: '/contacts' },
      { title: __('Companies'), link: '/contacts/companies' },
      { title }
    ];

    const content = (
      <>
        <ActivityInputs
          contentTypeId={company._id}
          contentType="company"
          toEmails={company.emails}
          showEmail={false}
        />
        <ActivityLogs
          target={company.primaryName || ''}
          contentId={company._id}
          contentType="company"
          extraTabs={[
            { name: 'conversation', label: 'Conversation' },
            { name: 'email', label: 'Email' }
          ]}
        />
      </>
    );

    return (
      <Wrapper
        header={<Wrapper.Header title={title} breadcrumb={breadcrumb} />}
        leftSidebar={
          <LeftSidebar
            {...this.props}
            taggerRefetchQueries={taggerRefetchQueries}
            toggleSection={this.toggleSection}
            config={getConfig(STORAGE_KEY)}
          />
        }
        rightSidebar={
          <RightSidebar
            company={company}
            toggleSection={this.toggleSection}
            config={getConfig(STORAGE_KEY)}
          />
        }
        content={content}
        transparent={true}
      />
    );
  }
}

export default CompanyDetails;
