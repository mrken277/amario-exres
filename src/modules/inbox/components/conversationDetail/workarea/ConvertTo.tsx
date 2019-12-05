import Button from 'modules/common/components/Button';
import DropdownToggle from 'modules/common/components/DropdownToggle';
import Icon from 'modules/common/components/Icon';
import { __ } from 'modules/common/utils';
import DealAddTrigger from 'modules/deals/components/DealAddTrigger';
import { IConversation } from 'modules/inbox/types';
import TaskAddTrigger from 'modules/tasks/components/TaskAddTrigger';
import TicketAddTrigger from 'modules/tickets/components/TicketAddTrigger';
import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import styled from 'styled-components';

const Container = styled.div`
  display: inline-block;

  .dropdown-menu {
    min-width: auto;
  }

  button {
    padding: 3px 12px;
    font-size: 9px;
  }
`;

type Props = {
  conversation: IConversation;
};

export default (props: Props) => {
  const { conversation } = props;

  const assignedUserIds = conversation.assignedUserId
    ? [conversation.assignedUserId]
    : [];
  const customerIds = conversation.customerId ? [conversation.customerId] : [];
  const sourceKind = conversation.integration.kind;
  const sourceKindId = conversation.integration._id;

  return (
    <Container>
      <Dropdown>
        <Dropdown.Toggle as={DropdownToggle} id="dropdown-convert-to">
          <Button size="small">
            {__('Convert to')} <Icon icon="angle-down" />
          </Button>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <li key="ticket">
            <TicketAddTrigger
              assignedUserIds={assignedUserIds}
              relTypeIds={customerIds}
              relType="customer"
              sourceKind={sourceKind}
              sourceKindId={sourceKindId}
            />
          </li>
          <li key="deal">
            <DealAddTrigger
              assignedUserIds={assignedUserIds}
              relTypeIds={customerIds}
              relType="customer"
              sourceKind={sourceKind}
              sourceKindId={sourceKindId}
            />
          </li>
          <li key="task">
            <TaskAddTrigger
              assignedUserIds={assignedUserIds}
              relTypeIds={customerIds}
              relType="customer"
              sourceKind={sourceKind}
              sourceKindId={sourceKindId}
            />
          </li>
        </Dropdown.Menu>
      </Dropdown>
    </Container>
  );
};
