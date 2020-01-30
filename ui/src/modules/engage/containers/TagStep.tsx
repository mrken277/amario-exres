import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ButtonMutate from 'modules/common/components/ButtonMutate';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import { IButtonMutateProps } from 'modules/common/types';
import checkError from 'modules/common/utils/checkError';
import { CountQueryResponse } from 'modules/customers/types';
import TagStep from 'modules/engage/components/step/TagStep';
import { mutations } from 'modules/tags/graphql';
import { TagsQueryResponse } from 'modules/tags/types';
import React from 'react';
import { queries } from '../graphql';
import { sumCounts } from '../utils';

type Props = {
  tagIds: string[];
  messageType: string;
  renderContent: (
    {
      actionSelector,
      selectedComponent,
      customerCounts
    }: {
      actionSelector: React.ReactNode;
      selectedComponent: React.ReactNode;
      customerCounts: React.ReactNode;
    }
  ) => React.ReactNode;
  onChange: (name: string, value: string[]) => void;
};

function TagStepContianer(props: Props) {

  const {
    loading: tagsLoading,
    error: tagsError,
    data: tagsData
  } = useQuery<TagsQueryResponse>(
    gql(queries.tags), {
    variables: { type: 'customer' }
  });

  const {
    loading: customerCountsLoading,
    error: customerCountsError,
    data: customerCountsData
  } = useQuery<CountQueryResponse, { only: string }>(
    gql(queries.customerCounts), {
    variables: {
      only: 'byTag'
    }
  });

  if (tagsError || customerCountsError) {
    const error = checkError([tagsError, customerCountsError]);

    return <ErrorMsg>{error.message}</ErrorMsg>;
  };

  if (tagsLoading || customerCountsLoading) {
    return <Spinner objective={true} />;
  };

  const customerCounts = customerCountsData ? customerCountsData.customerCounts : {
    byTag: {}
  };

  const countValues = customerCounts.byTag || {};
  const customersCount = (ids: string[]) => sumCounts(ids, countValues);

  const renderButton = ({
    values,
    isSubmitted,
    callback
  }: IButtonMutateProps) => {
    return (
      <ButtonMutate
        mutation={mutations.add}
        variables={values}
        callback={callback}
        refetchQueries={getRefetchQueries()}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`You successfully added a tag`}
      />
    );
  };

  const updatedProps = {
    ...props,
    tags: tagsData ? tagsData.tags : [],
    targetCount: countValues,
    customersCount,
    renderButton
  };

  return <TagStep {...updatedProps} />;
}

const getRefetchQueries = () => {
  return [
    {
      query: gql(queries.customerCounts),
      variables: { only: 'byTag' }
    },
    {
      query: gql(queries.tags),
      variables: { type: 'customer' }
    }
  ];
};

export default TagStepContianer;
