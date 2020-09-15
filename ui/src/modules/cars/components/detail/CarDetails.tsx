import ActivityInputs from 'modules/activityLogs/components/ActivityInputs';
import ActivityLogs from 'modules/activityLogs/containers/ActivityLogs';
import { IUser } from 'modules/auth/types';

import { ICar } from 'modules/cars/types';
import { __ } from 'modules/common/utils';
import Wrapper from 'modules/layout/components/Wrapper';
import React from 'react';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';

type Props = {
  car: ICar;
  currentUser: IUser;
  taggerRefetchQueries?: any[];
};

class CarDetails extends React.Component<Props> {
  render() {
    const { car, taggerRefetchQueries } = this.props;

    const title = car.plateNumber || 'Unknown';

    const breadcrumb = [{ title: __('Cars'), link: '/cars' }, { title }];

    const content = (
      <>
        <ActivityInputs
          contentTypeId={car._id}
          contentType="car"
          showEmail={false}
        />
        <ActivityLogs
          target={car.plateNumber || ''}
          contentId={car._id}
          contentType="car"
          extraTabs={[]}
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
          />
        }
        rightSidebar={<RightSidebar car={car} />}
        content={content}
        transparent={true}
      />
    );
  }
}

export default CarDetails;
