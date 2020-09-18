import { IButtonMutateProps, IRouterProps } from 'modules/common/types';
import React, { useEffect, useState } from 'react';
import DashbaordForm from '../containers/DashboardForm';
import { BoxContainer, ProjectItem } from '../styles';
import { IDashboard } from '../types';
import DashboardRow from './DashboardRow';

type Props = {
  dashboards: IDashboard[];
  renderAddButton: (props: IButtonMutateProps) => JSX.Element;
};

type FinalProps = {} & Props & IRouterProps;

function DashboardList(props: FinalProps) {
  const [showPopup, setVisibility] = useState(false);

  const toggleVisibility = () => {
    setVisibility(!showPopup);
  };

  const renderAddForm = () => {
    return <DashbaordForm show={showPopup} closeModal={toggleVisibility} />;
  };

  useEffect(() => {
    if(dashboards.length > 0) {
      props.history.replace(`/dashboard/${dashboards[0]._id}`);
    }
  });

  const { dashboards } = props;
  

  return (
    <BoxContainer>
      <div>
        <ProjectItem new={true} onClick={toggleVisibility}>
          <h5>
            +<br />
            Create <br />
            New <br />
            Dashboard
          </h5>
        </ProjectItem>
      </div>
      {renderAddForm()}
      {dashboards.map((dashboard) => (
        <DashboardRow key={dashboard._id} dashboard={dashboard} />
      ))}
    </BoxContainer>
  );
}

export default DashboardList;
