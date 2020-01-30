import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ButtonMutate from 'modules/common/components/ButtonMutate';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import { IButtonMutateProps } from 'modules/common/types';
import checkError from 'modules/common/utils/checkError';
import { CountQueryResponse } from 'modules/customers/types';
import {
  AddMutationResponse,
  AddMutationVariables,
  HeadSegmentsQueryResponse,
  SegmentsQueryResponse
} from 'modules/segments/types';
import { FieldsCombinedByTypeQueryResponse } from 'modules/settings/properties/types';
import React from 'react';
import SegmentStep from '../components/step/SegmentStep';
import { mutations, queries } from '../graphql';
import { sumCounts } from '../utils';

type Props = {
  segmentIds: string[];
  messageType: string;
  onChange: (name: string, value: string[]) => void;
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
};

function SegmentStepContainer(props: Props) {

  const {
    loading: segmentsLoading,
    error: segmentsError,
    data: segmentsData,
    refetch: segmentsRefetch
  } = useQuery<SegmentsQueryResponse>(
    gql(queries.segments));

  const {
    loading: customerCountsLoading,
    error: customerCountsError,
    data: customerCountsData,
    refetch: customerCountsRefetch
  } = useQuery<CountQueryResponse>(
    gql(queries.customerCounts), {
    variables: {
      only: 'bySegment'
    }
  });

  const {
    loading: headSegmentsLoading,
    error: headSegmentsError,
    data: headSegmentsData
  } = useQuery<HeadSegmentsQueryResponse>(
    gql(queries.headSegments));

  const [,
    { loading: segmentsAddLoading,
      error: segmentsAddError
    }] = useMutation<AddMutationResponse, AddMutationVariables>(
      gql(mutations.segmentsAdd));

  const {
    loading: combinedFieldsLoading,
    error: combinedFieldsError,
    data: combinedFieldsData
  } = useQuery<FieldsCombinedByTypeQueryResponse>(
    gql(queries.combinedFields));

  if (segmentsError || customerCountsError || headSegmentsError || segmentsAddError || combinedFieldsError) {
    const error = checkError([segmentsError, customerCountsError, headSegmentsError, segmentsAddError, combinedFieldsError]);

    return <ErrorMsg>{error.message}</ErrorMsg>;
  };

  if (segmentsLoading || customerCountsLoading || headSegmentsLoading || segmentsAddLoading || combinedFieldsLoading) {
    return <Spinner objective={true} />;
  };

  const customerCounts = (customerCountsData && customerCountsData.customerCounts) || {
    bySegment: {}
  };

  const countValues = customerCounts.bySegment || {};
  const customersCount = (ids: string[]) => sumCounts(ids, countValues);

  const segmentFields = combinedFieldsData && combinedFieldsData.fieldsCombinedByContentType
    ? combinedFieldsData.fieldsCombinedByContentType.map(
      ({ name, label }) => ({
        _id: name,
        title: label,
        selectedBy: 'none'
      })
    )
    : [];

  const count = segment => {
    customerCountsRefetch({
      byFakeSegment: segment
    });
  };

  const renderButton = ({
    values,
    isSubmitted,
    callback
  }: IButtonMutateProps) => {
    const callBackResponse = () => {
      segmentsRefetch();
      customerCountsRefetch();

      if (callback) {
        callback();
      }
    };

    return (
      <ButtonMutate
        mutation={mutations.segmentsAdd}
        variables={values}
        callback={callBackResponse}
        isSubmitted={isSubmitted}
        btnSize="small"
        type="submit"
        successMessage={`You successfully added a segment`}
      />
    );
  };

  const updatedProps = {
    ...props,
    headSegments: (headSegmentsData && headSegmentsData.segmentsGetHeads) || [],
    segmentFields,
    renderButton,
    segments: (segmentsData && segmentsData.segments) || [],
    targetCount: countValues,
    customersCount,
    count
  };

  return <SegmentStep {...updatedProps} />;
}

export default SegmentStepContainer;