import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { queries } from 'modules/forms/graphql';
import { FormsQueryResponse } from 'modules/forms/types';
import React from 'react';
import FormList from '../components/FormList';

type Props = {
  onChangeForm: (stageId: string, value: string) => void;
  stage: any;
};

const FormListContainer = (props: Props) => {
  const {
    loading: formsQueryLoading,
    error: formsQueryError,
    data: formsQueryData
  } = useQuery<FormsQueryResponse>(gql(queries.forms));

  const forms = formsQueryData ? formsQueryData.forms : [];

  const extendProps = {
    ...props,
    forms
  };

  if (formsQueryError) {
    return <p>Error!</p>;
  }

  if (formsQueryLoading) {
    return <p>Loading...</p>;
  }

  return <FormList {...extendProps} />;
}

export default FormListContainer;
