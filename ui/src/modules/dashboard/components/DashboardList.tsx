import EmptyState from 'modules/common/components/EmptyState';
import Spinner from 'modules/common/components/Spinner';
import { IRouterProps } from 'modules/common/types';
import React from 'react';
import DashbaordForm from '../containers/DashboardForm';
import { BoxContainer, ProjectItem } from '../styles';
import { IDashboard } from '../types';
import DashboardRow from './DashboardRow';

type Props = {
  dashboards: IDashboard[];
  loading: boolean;
};

type FinalProps = {} & Props & IRouterProps;

function DashboardList(props: FinalProps) {
  const { dashboards, loading } = props;
  
  if (loading) {
    return (<Spinner />)
  }

  if (dashboards.length === 0) {
    return (
      <>
        <EmptyState
          image="/images/actions/8.svg"
          text="There is no Dashboard"
          size="full"
          extra={<DashbaordForm />}
        />
      </>
    ) 
  }

  return (
    <BoxContainer>
      <div>
        <ProjectItem new={true} >
          <h5>
            +<br />
            Create <br />
            New <br />
            Dashboard
          </h5>
        </ProjectItem>
      </div>
      
      {dashboards.map((dashboard) => (
        <DashboardRow key={dashboard._id} dashboard={dashboard} />
      ))}
    </BoxContainer>
  );
}

export default DashboardList;
