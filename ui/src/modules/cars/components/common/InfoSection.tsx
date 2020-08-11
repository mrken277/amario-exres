import Icon from 'modules/common/components/Icon';
import ModalTrigger from 'modules/common/components/ModalTrigger';
import { InfoWrapper } from 'modules/common/styles/main';
import { Name, NameContainer } from 'modules/customers/styles';
import React from 'react';
import CarForm from '../../containers/CarForm';
import { ICar } from '../../types';

type Props = {
  car: ICar;
  children?: React.ReactNode;
};

class InfoSection extends React.Component<Props> {
  render() {
    const { car, children } = this.props;

    const content = props => <CarForm {...props} car={car} />;

    return (
      <InfoWrapper>
        <NameContainer>
          <Name fontSize={16}>
            {car.plateNumber}

            <ModalTrigger
              title="Edit basic info"
              trigger={<Icon icon="pen-1" />}
              size="lg"
              content={content}
            />
          </Name>
        </NameContainer>
        {children}
      </InfoWrapper>
    );
  }
}

export default InfoSection;
