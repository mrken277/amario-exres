import dayjs from 'dayjs';
import Box from 'modules/common/components/Box';
import { __ } from 'modules/common/utils';
import { ICompany } from 'modules/companies/types';
import CustomerAssociate from 'modules/customers/containers/CustomerAssociate';
import PortableDeals from 'modules/deals/components/PortableDeals';
import Sidebar from 'modules/layout/components/Sidebar';
import PortableTasks from 'modules/tasks/components/PortableTasks';
import PortableTickets from 'modules/tickets/components/PortableTickets';
import React from 'react';
import { List } from '../../styles';

type Props = {
  toggleSection: (params: { name: string; isOpen: boolean }) => void;
  config: { [key: string]: boolean };
  company: ICompany;
};
export default class RightSidebar extends React.Component<Props> {
  renderPlan(company) {
    if (!company.plan) {
      return null;
    }

    return (
      <li>
        <div>{__('Plan')}: </div>
        <span>{company.plan}</span>
      </li>
    );
  }

  render() {
    const { company, config, toggleSection } = this.props;

    const { Section } = Sidebar;
    const { Title } = Section;

    return (
      <Sidebar>
        <Box
          title={__('Customers')}
          name="showCustomers"
          isOpen={config.showCustomers || false}
          toggle={toggleSection}
        >
          <CustomerAssociate data={company} />
        </Box>
        <Box
          title={__('Deal')}
          name="showDeal"
          isOpen={config.showDeal || false}
          toggle={toggleSection}
        >
          <PortableDeals
            companyIds={[company._id]}
            isOpen={config.showDeal || false}
          />
        </Box>
        <Box
          title={__('Ticket')}
          name="showTicket"
          isOpen={config.showTicket || false}
          toggle={toggleSection}
        >
          <PortableTickets
            companyIds={[company._id]}
            isOpen={config.showTicket || false}
          />
        </Box>
        <Box
          title={__('Task')}
          name="showTask"
          isOpen={config.showTask || false}
          toggle={toggleSection}
        >
          <PortableTasks
            companyIds={[company._id]}
            isOpen={config.showTask || false}
          />
        </Box>
        <Box
          title={__('Other')}
          name="showOther"
          isOpen={config.showOther || false}
          toggle={toggleSection}
        >
          <Section>
            <Title>{__('Other')}</Title>
            <List>
              <li>
                <div>{__('Created at')}: </div>{' '}
                <span>{dayjs(company.createdAt).format('lll')}</span>
              </li>
              <li>
                <div>{__('Modified at')}: </div>{' '}
                <span>{dayjs(company.modifiedAt).format('lll')}</span>
              </li>
              {this.renderPlan(company)}
            </List>
          </Section>
        </Box>
      </Sidebar>
    );
  }
}
