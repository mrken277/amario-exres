import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import checkError from 'modules/common/utils/checkError';
import React from 'react';
import { BrandsQueryResponse } from '../../settings/brands/types';
import MessageForm from '../components/MessageForm';
import { queries } from '../graphql';
import { EngageMessageDetailQueryResponse } from '../types';

type Props = {
  kind?: string;
  messageId?: string;
};

function EmailContainer(props: Props) {
  const { kind, messageId } = props;

  const {
    data: engageMessageDetailData,
    error: engageMessageDetailError,
    loading: engageMessageDetailLoading
  } = useQuery<EngageMessageDetailQueryResponse, { _id?: string }>(
    gql(queries.engageMessageDetail), {
    variables: {
      _id: messageId
    }
  });

  const {
    data: brandsData,
    error: brandsError,
    loading: brandsLoading
  } = useQuery<BrandsQueryResponse>(
    gql(queries.brands));

  if (engageMessageDetailLoading || brandsLoading) {
    return <Spinner objective={true} />;
  };

  if (brandsError || engageMessageDetailError) {
    const error = checkError([brandsError, engageMessageDetailError]);

    return <ErrorMsg>{error.message}</ErrorMsg>;
  };

  const message = engageMessageDetailData && engageMessageDetailData.engageMessageDetail;
  const brands = (brandsData && brandsData.brands) || [];

  const updatedProps = {
    ...props,
    kind: message ? message.kind : kind,
    brands,
    scheduleDate: message && message.scheduleDate
  };

  return <MessageForm {...updatedProps} />;
}
export default EmailContainer;
