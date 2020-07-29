import ActivityInputs from 'modules/activityLogs/components/ActivityInputs';
import ActivityLogs from 'modules/activityLogs/containers/ActivityLogs';
import { IUser } from 'modules/auth/types';
import { __ } from 'modules/common/utils';
import BasicInfo from 'modules/cars/containers/detail/BasicInfo';
import { ICar } from 'modules/cars/types';
import { UserHeader } from 'modules/customers/styles';
import Wrapper from 'modules/layout/components/Wrapper';
import React from 'react';
import InfoSection from '../common/InfoSection';
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

    const title = car.primaryName || 'Unknown';

    const breadcrumb = [{ title: __('Cars'), link: '/cars' }, { title }];

    const content = (
      <>
        <ActivityInputs
          contentTypeId={car._id}
          contentType="car"
          toEmails={car.emails}
          showEmail={false}
        />
        <ActivityLogs
          target={car.primaryName || ''}
          contentId={car._id}
          contentType="car"
          extraTabs={[]}
        />
      </>
    );

    return (
      <Wrapper
        header={<Wrapper.Header title={title} breadcrumb={breadcrumb} />}
        mainHead={
          <UserHeader>
            <InfoSection car={car}>
              <BasicInfo car={car} />
            </InfoSection>
          </UserHeader>
        }
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
