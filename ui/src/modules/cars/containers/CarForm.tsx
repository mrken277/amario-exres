import ButtonMutate from 'modules/common/components/ButtonMutate';
import { IButtonMutateProps } from 'modules/common/types';
import React from 'react';
import { IUser } from '../../auth/types';
import { UsersQueryResponse } from '../../settings/team/types';
import CarForm from '../components/list/CarForm';
import { mutations } from '../graphql';
import { ICar } from '../types';

type Props = {
  car: ICar;
  getAssociatedCar?: (carId: string) => void;
  closeModal: () => void;
};

type FinalProps = {
  usersQuery: UsersQueryResponse;
  currentUser: IUser;
} & Props;

const CarFromContainer = (props: FinalProps) => {
  const renderButton = ({
    name,
    values,
    isSubmitted,
    object
  }: IButtonMutateProps) => {
    const { closeModal, getAssociatedCar } = props;

    const afterSave = data => {
      closeModal();

      if (getAssociatedCar) {
        getAssociatedCar(data.carsAdd);
      }
    };

    return (
      <ButtonMutate
        mutation={object ? mutations.carsEdit : mutations.carsAdd}
        variables={values}
        callback={afterSave}
        refetchQueries={getRefetchQueries()}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`You successfully ${
          object ? 'updated' : 'added'
        } a ${name}`}
      />
    );
  };

  const updatedProps = {
    ...props,
    renderButton
  };

  return <CarForm {...updatedProps} />;
};

const getRefetchQueries = () => {
  return [
    'carsMain',
    'carDetail',
    // cars for customer detail car associate
    'cars',
    'carCounts'
  ];
};

export default CarFromContainer;
