import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import { Alert } from 'modules/common/utils';
import { confirm } from 'modules/common/utils';
import checkError from 'modules/common/utils/checkError';
import React from 'react';
import SegmentsList from '../components/SegmentsList';
import { mutations, queries } from '../graphql';
import { RemoveMutationResponse, SegmentsQueryResponse } from '../types';

type Props = {
  contentType: string;
};

const SegmentListContainer = (props: Props) => {
  const { contentType } = props;

  const {
    loading: segmentsQueryLoading,
    error: segmentsQueryError,
    data: segmentsQueryData
  } = useQuery<SegmentsQueryResponse, { contentType: string }>(
    gql(queries.segments),
    {
      variables: { contentType },
      fetchPolicy: 'network-only'
    }
  );

  const [removeMutation, { error: segmentsRemoveMutationError }] = useMutation<
    RemoveMutationResponse,
    { _id: string }
  >(gql(mutations.segmentsRemove), {
    refetchQueries: [
      {
        query: gql(queries.segments),
        variables: { contentType }
      }
    ]
  });

  const removeSegment = segmentId => {
    confirm().then(() => {
      removeMutation({
        variables: { _id: segmentId }
      })
        .then(() => {
          Alert.success('You successfully deleted a segment');
        })
        .catch(error => {
          Alert.error(error.message);
        });
    });
  };

  if (segmentsQueryError || segmentsRemoveMutationError) {
    const error = checkError([segmentsQueryError, segmentsRemoveMutationError]);

    return <ErrorMsg>{error.message}</ErrorMsg>;
  }

  if (segmentsQueryLoading) {
    return <Spinner objective={true} />;
  }

  const updatedProps = {
    ...props,
    segments: segmentsQueryData ? segmentsQueryData.segments : [],
    removeSegment
  };

  return <SegmentsList {...updatedProps} />;
};

export default SegmentListContainer;
