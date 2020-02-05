import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ButtonMutate from 'modules/common/components/ButtonMutate';
import Spinner from 'modules/common/components/Spinner';
import { IButtonMutateProps, IFormProps } from 'modules/common/types';
import { mutations as brandMutations } from 'modules/settings/brands/graphql';
import { queries as brandQueries } from 'modules/settings/brands/graphql';
import React from 'react';
import { ChildProps } from 'react-apollo';
import { AllBrandsQueryResponse } from '../../brands/types';
import SelectBrand from '../components/SelectBrand';

type Props = {
  onChange?: (e?: any) => void;
  defaultValue?: string;
  creatable?: boolean;
  isRequired?: boolean;
  formProps?: IFormProps;
};

const SelectBrandContainer = (props: ChildProps<Props>) => {
  const { formProps } = props;

  const {
    loading: brandsQueryLoading,
    error: brandsQueryError,
    data: brandsQueryData
  } = useQuery<AllBrandsQueryResponse>(gql(brandQueries.brands)
  );

  const brands = brandsQueryData ? brandsQueryData.brands : [];

  if (brandsQueryLoading) {
    return <Spinner objective={true} />;
  }

  if (brandsQueryError) {
    return <p>Error!</p>;
  }

  const renderButton = ({
    name,
    values,
    isSubmitted,
    callback
  }: IButtonMutateProps) => {
    const callBackResponse = () => {
      // brandsQuery.refetch();

      if (callback) {
        callback();
      }
    };

    return (
      <ButtonMutate
        mutation={brandMutations.brandAdd}
        variables={values}
        callback={callBackResponse}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`You successfully added a ${name}`}
      />
    );
  };

  const updatedProps = {
    ...props,
    brands,
    formProps,
    renderButton
  };

  return <SelectBrand {...updatedProps} />;
};

export default SelectBrandContainer;
