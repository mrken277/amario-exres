import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import { IButtonMutateProps } from 'modules/common/types';
import { queries } from 'modules/settings/brands/graphql';
import React from 'react';
import { BrandsQueryResponse } from '../../../settings/brands/types';
import KnowledgeForm from '../../components/knowledge/KnowledgeForm';
import { ITopic } from '../../types';

type Props = {
  topic: ITopic;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
};

type FinalProps = { getBrandListQuery: BrandsQueryResponse } & Props;

function TopicAddFormContainer(props: FinalProps) {
  const { topic } = props;

  const {
    data: getBrandListData,
    error: getBrandListError,
    loading: getBrandListLoading
  } = useQuery<BrandsQueryResponse>(
    gql(queries.brands), {
    fetchPolicy: 'network-only'
  }
  );

  if (getBrandListLoading) {
    return <Spinner objective={true} />;
  }

  if (getBrandListError) {
    return <ErrorMsg>{getBrandListError.message}</ErrorMsg>;
  }

  const updatedProps = {
    ...props,
    topic,
    brands: getBrandListData ? getBrandListData.brands : []
  };

  return <KnowledgeForm {...updatedProps} />;
}

export default TopicAddFormContainer;