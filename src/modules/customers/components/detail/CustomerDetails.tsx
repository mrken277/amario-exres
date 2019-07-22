import client from 'apolloClient';
import gql from 'graphql-tag';
import ActivityInputs from 'modules/activityLogs/components/ActivityInputs';
import ActivityLogs from 'modules/activityLogs/containers/ActivityLogs';
import Icon from 'modules/common/components/Icon';
import { TabTitle } from 'modules/common/components/tabs';
import { __, renderFullName } from 'modules/common/utils';
import Widget from 'modules/engage/containers/Widget';
import { queries } from 'modules/inbox/graphql';
import { IConversation } from 'modules/inbox/types';
import { getConfig, setConfig } from 'modules/inbox/utils';
import Wrapper from 'modules/layout/components/Wrapper';
import React from 'react';
import { ICustomer } from '../../types';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
type Props = {
  customer: ICustomer;
  taggerRefetchQueries?: any[];
  conversation: IConversation;
};

const STORAGE_KEY = `erxes_sidebar_section_config`;

class CustomerDetails extends React.Component<Props> {
  renderEmailTab = () => {
    const { customer } = this.props;

    if (!customer.primaryEmail) {
      return null;
    }

    const triggerEmail = (
      <TabTitle>
        <Icon icon="email-4" /> {__('New email')}
      </TabTitle>
    );

    return (
      <Widget
        customers={[this.props.customer]}
        modalTrigger={triggerEmail}
        channelType="email"
      />
    );
  };

  renderExtraTabs = () => {
    const triggerMessenger = (
      <TabTitle>
        <Icon icon="speech-bubble-3" /> {__('New message')}
      </TabTitle>
    );

    return (
      <>
        <Widget
          customers={[this.props.customer]}
          modalTrigger={triggerMessenger}
          channelType="messenger"
        />
        {this.renderEmailTab()}
      </>
    );
  };

  getCustomerDetail(customerId?: string) {
    if (!customerId) {
      return null;
    }

    const sectionParams = getConfig(STORAGE_KEY);

    this.setState({ loading: true });

    client
      .query({
        query: gql(queries.generateCustomerDetailQuery(sectionParams)),
        fetchPolicy: 'network-only',
        variables: { _id: customerId }
      })
      .then(({ data }: { data: any }) => {
        if (data && data.customerDetail) {
          this.setState({ customer: data.customerDetail, loading: false });
        }
      })
      .catch(error => {
        console.log(error.message); // tslint:disable-line
      });

    return;
  }

  toggleSection = ({ name, isOpen }: { name: string; isOpen: boolean }) => {
    // const customerId = this.props.conversation.customerId;
    const config = getConfig(STORAGE_KEY);

    config[name] = isOpen;

    setConfig(STORAGE_KEY, config);

    // this.getCustomerDetail(customerId);
  };

  render() {
    const { customer, taggerRefetchQueries } = this.props;

    const breadcrumb = [
      { title: __('Contacts'), link: '/contacts' },
      { title: __('Customers'), link: '/contacts/customers/all' },
      { title: renderFullName(customer) }
    ];

    const content = (
      <>
        <ActivityInputs
          contentTypeId={customer._id}
          contentType="customer"
          toEmail={customer.primaryEmail}
          showEmail={false}
          extraTabs={this.renderExtraTabs()}
        />
        <ActivityLogs
          target={customer.firstName}
          contentId={customer._id}
          contentType="customer"
          extraTabs={[
            { name: 'conversation', label: 'Conversation' },
            { name: 'email', label: 'Email' }
          ]}
        />
      </>
    );

    const updatedProps = {
      customer,
      toggleSection: this.toggleSection,
      config: getConfig(STORAGE_KEY)
    };

    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={renderFullName(customer)}
            breadcrumb={breadcrumb}
          />
        }
        leftSidebar={
          <LeftSidebar
            wide={true}
            customer={customer}
            taggerRefetchQueries={taggerRefetchQueries}
          />
        }
        rightSidebar={<RightSidebar {...updatedProps} />}
        // rightSidebar={<RightSidebar customer={customer} />}
        content={content}
        transparent={true}
      />
    );
  }
}

export default CustomerDetails;
