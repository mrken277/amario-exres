import { Icon } from '@ant-design/compatible';
import { Card, Dropdown, Menu } from 'antd';
import React from 'react';
// import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  box-shadow: 0px 2px 4px rgba(141, 149, 166, 0.1);
  border-radius: 4px;
  height: 100%;
  width: 100%;

  .ant-card-head {
    border: none;
  }

  .ant-card-body {
    padding-top: 10px;
  }
`;

const DashboardItemDropdown = ({ item, dashboardId, save }) => {
  const saveChart = () => {
    const doc = {
      name: item.name,
      dashboardId,
      vizState: item.vizState,
      type: item.type,
    };

    return save(doc);
  };

  const dashboardItemDropdownMenu = (
    <Menu>
      <Menu.Item onClick={() => saveChart()}>Save to dashboard</Menu.Item>
      <Menu.Item>
        <a
          href={`/explore?itemName=${item.name}&dashboardId=${dashboardId}&vizState=${item.vizState}&type=${item.type}`}
        >
          Edit in builder
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown
      overlay={dashboardItemDropdownMenu}
      placement="bottomLeft"
      trigger={['click']}
    >
      <Icon type="menu" />
    </Dropdown>
  );
};

const InitialDataItem = ({ item, dashboardId, children, title, save }) => (
  <StyledCard
    title={title}
    bordered={false}
    extra={
      <DashboardItemDropdown
        item={item}
        dashboardId={dashboardId}
        save={save}
      />
    }
  >
    {children}
  </StyledCard>
);

export default InitialDataItem;
