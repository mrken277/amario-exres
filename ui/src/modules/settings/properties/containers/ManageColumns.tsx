import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import { Alert } from 'modules/common/utils';
import checkError from 'modules/common/utils/checkError';
import { queries } from 'modules/forms/graphql';
import React from 'react';
import ManageColumns from '../components/ManageColumns';
import {
  DefaultColumnsConfigQueryResponse,
  FieldsCombinedByTypeQueryResponse
} from '../types';

type Props = {
  contentType: string;
  location: any;
  history: any;
  closeModal: () => void;
};

const ManageColumnsContainer = (props: Props) => {
  const {
    contentType,
    location,
    history
  } = props;

  const {
    loading: fieldsQueryLoading,
    error: fieldsQueryError,
    data: fieldsQueryData
  } = useQuery<FieldsCombinedByTypeQueryResponse>(
    gql(queries.fieldsCombinedByContentType), {
    variables: {
      contentType
    }
  });

  const {
    loading: fieldsDefaultColumnsConfigQueryLoading,
    error: fieldsDefaultColumnsConfigQueryError,
    data: fieldsDefaultColumnsConfigQueryData
  } = useQuery<DefaultColumnsConfigQueryResponse>(
    gql(queries.fieldsDefaultColumnsConfig), {
    variables: {
      contentType
    }
  });

  if (fieldsQueryError || fieldsDefaultColumnsConfigQueryError) {
    const error = checkError([fieldsQueryError, fieldsDefaultColumnsConfigQueryError]);

    return <ErrorMsg>{error.message}</ErrorMsg>;
  }

  if (fieldsQueryLoading || fieldsDefaultColumnsConfigQueryLoading) {
    return <Spinner objective={true} />;
  }

  const storageKey = `erxes_${contentType}_columns_config`;
  const storageItem = localStorage.getItem(storageKey);

  const save = config => {
    localStorage.setItem(storageKey, JSON.stringify(config));

    Alert.success('Success');

    if (history && location) {
      history.push(location.pathname);
    }
  };

  let columnsConfig =
    fieldsDefaultColumnsConfigQueryData ? fieldsDefaultColumnsConfigQueryData.fieldsDefaultColumnsConfig : [];

  if (storageItem) {
    columnsConfig = JSON.parse(storageItem);
  }

  const updatedProps = {
    ...props,
    config: columnsConfig,
    save,
    fields: fieldsQueryData ? fieldsQueryData.fieldsCombinedByContentType : []
  };

  return <ManageColumns {...updatedProps} />;
};

export default ManageColumnsContainer;
