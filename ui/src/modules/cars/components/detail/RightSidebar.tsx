import dayjs from 'dayjs';
import { ICar } from 'modules/cars/types';
import Box from 'modules/common/components/Box';
import { __ } from 'modules/common/utils';
import CompanySection from 'modules/companies/components/common/CompanySection';
import CustomerSection from 'modules/customers/components/common/CustomerSection';
import PortableDeals from 'modules/deals/components/PortableDeals';
import Sidebar from 'modules/layout/components/Sidebar';
import PortableTasks from 'modules/tasks/components/PortableTasks';
import PortableTickets from 'modules/tickets/components/PortableTickets';
import React from 'react';
import { List } from '../../styles';

type Props = {
  car: ICar;
};

export default class RightSidebar extends React.Component<Props> {
  renderPlan(car) {
    if (!car.plan) {
      return null;
    }

    return (
      <li>
        <div>{__('Plan')}: </div>
        <span>{car.plan}</span>
      </li>
    );
  }

  render() {
    const { car } = this.props;

    return (
      <Sidebar>
        <CustomerSection mainType="car" mainTypeId={car._id} />
        <CompanySection mainType="car" mainTypeId={car._id} />
        <PortableDeals mainType="car" mainTypeId={car._id} />
        <PortableTickets mainType="car" mainTypeId={car._id} />
        <PortableTasks mainType="car" mainTypeId={car._id} />

        <Box title={__('Other')} name="showOthers">
          <List>
            <li>
              <div>{__('Created at')}: </div>{' '}
              <span>{dayjs(car.createdAt).format('lll')}</span>
            </li>
            <li>
              <div>{__('Modified at')}: </div>{' '}
              <span>{dayjs(car.modifiedAt).format('lll')}</span>
            </li>
            {this.renderPlan(car)}
          </List>
        </Box>
      </Sidebar>
    );
  }
}
