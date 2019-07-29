import Box from 'modules/common/components/Box';
import EmptyState from 'modules/common/components/EmptyState';
import { __ } from 'modules/common/utils';
import CompanyAssociate from 'modules/companies/containers/CompanyAssociate';
import { List } from 'modules/companies/styles';
import { ICustomer } from 'modules/customers/types';
import PortableDeals from 'modules/deals/components/PortableDeals';
import Sidebar from 'modules/layout/components/Sidebar';
import PortableTasks from 'modules/tasks/components/PortableTasks';
import PortableTickets from 'modules/tickets/components/PortableTickets';
import React from 'react';

type IndexProps = {
  toggleSection: (params: { name: string; isOpen: boolean }) => void;
  config: { [key: string]: boolean };
  customer: ICustomer;
};

export default class RightSidebar extends React.Component<IndexProps> {
  renderContent() {
    const { customer } = this.props;
    const { integration, visitorContactInfo } = customer;

    if (!integration && !visitorContactInfo) {
      return <EmptyState icon="clipboard" text="Empty" size="small" />;
    }

    return (
      <List>
        {integration && integration.name && (
          <li>
            <div>{__('Integration')}:</div>
            <span>{integration.name}</span>
          </li>
        )}
        {visitorContactInfo && (
          <li>
            <div>{__('Visitor contact info')}:</div>
            <span>{visitorContactInfo.email || visitorContactInfo.phone}</span>
          </li>
        )}
      </List>
    );
  }

  renderOther() {
    const { Section } = Sidebar;
    const { Title } = Section;
    const { config, toggleSection } = this.props;
    return (
      <Box
        title={__('Other')}
        name="showOthers"
        isOpen={config.showOthers || false}
        toggle={toggleSection}
      >
        <Section>
          <Title>{__('Other')}</Title>
          {this.renderContent()}
        </Section>
      </Box>
    );
  }

  render() {
    const { customer, config, toggleSection } = this.props;

    return (
      <Sidebar>
        <Box
          title={__('Companies')}
          name="showCompanies"
          isOpen={config.showCompanies || false}
          toggle={toggleSection}
        >
          <CompanyAssociate
            data={customer}
            isOpen={config.showCompanies || false}
          />
        </Box>

        <Box
          title={__('Deal')}
          name="showDeals"
          isOpen={config.showDeals || false}
          toggle={toggleSection}
        >
          <PortableDeals
            customerIds={[customer._id]}
            isOpen={config.showDeals || false}
          />
        </Box>

        <Box
          title={__('Ticket')}
          name="showTickets"
          isOpen={config.showTickets || false}
          toggle={toggleSection}
        >
          <PortableTickets
            customerIds={[customer._id]}
            isOpen={config.showTickets || false}
          />
        </Box>

        <Box
          title={__('Task')}
          name="showTasks"
          isOpen={config.showTasks || false}
          toggle={toggleSection}
        >
          <PortableTasks
            customerIds={[customer._id]}
            isOpen={config.showTasks || false}
          />
        </Box>
        {this.renderOther()}
      </Sidebar>
    );
  }
}
