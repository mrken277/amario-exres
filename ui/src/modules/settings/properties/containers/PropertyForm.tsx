import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ButtonMutate from 'modules/common/components/ButtonMutate';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import { IButtonMutateProps } from 'modules/common/types';
import checkError from 'modules/common/utils/checkError';
import React from 'react';
import PropertyForm from '../components/PropertyForm';
import { mutations, queries } from '../graphql';
import {
  FieldsAddMutationResponse,
  FieldsEditMutationResponse,
  FieldsGroupsQueryResponse
} from '../types';

type Props = {
  queryParams: any;
  closeModal: () => void;
};

type FinalProps = {
  fieldsGroupsQuery: FieldsGroupsQueryResponse;
} & Props &
  FieldsAddMutationResponse &
  FieldsEditMutationResponse;

const PropertyFormContainer = (props: FinalProps) => {
  const { queryParams } = props;

  const {
    loading: fieldsGroupsQueryLoading,
    error: fieldsGroupsQueryError,
    data: fieldsGroupsQueryData
  } = useQuery<FieldsGroupsQueryResponse>(
    gql(queries.fieldsGroups),
    {
      variables: {
        contentType: queryParams.type || ''
      }
    }
  );

  if (fieldsGroupsQueryError) {
    const error = checkError([fieldsGroupsQueryError]);

    return <ErrorMsg>{error.message}</ErrorMsg>;
  }

  if (fieldsGroupsQueryLoading) {
    return <Spinner objective={true} />;
  }

  const renderButton = ({
    name,
    values,
    isSubmitted,
    callback,
    object
  }: IButtonMutateProps) => {
    return (
      <ButtonMutate
        mutation={object ? mutations.fieldsEdit : mutations.fieldsAdd}
        variables={values}
        callback={callback}
        refetchQueries={getRefetchQueries(queryParams)}
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
    type: queryParams.type,
    renderButton,
    groups: fieldsGroupsQueryData ? fieldsGroupsQueryData.fieldsGroups : [],
    refetchQueries: getRefetchQueries(queryParams)
  };

  return <PropertyForm {...updatedProps} />;
};

const getRefetchQueries = queryParams => {
  return [
    {
      query: gql(queries.fieldsGroups),
      variables: { contentType: queryParams.type }
    }
  ];
};

export default PropertyFormContainer;
