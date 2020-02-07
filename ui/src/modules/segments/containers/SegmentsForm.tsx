import { useQuery } from '@apollo/react-hooks';
import client from 'apolloClient';
import gql from 'graphql-tag';
import ButtonMutate from 'modules/common/components/ButtonMutate';
import { IButtonMutateProps } from 'modules/common/types';
import { Alert } from 'modules/common/utils';
import { queries as companyQueries } from 'modules/companies/graphql';
import { queries as customerQueries } from 'modules/customers/graphql';
import React, { useState } from 'react';
import { FieldsCombinedByTypeQueryResponse } from '../../settings/properties/types';
import SegmentsForm from '../components/SegmentsForm';
import { mutations, queries } from '../graphql';
import {
  HeadSegmentsQueryResponse,
  ISegment,
  ISegmentDoc,
  SegmentDetailQueryResponse
} from '../types';

type Props = {
  contentType: string;
  history: any;
  id?: string;
};

type State = {
  total: { byFakeSegment?: number };
  loading: boolean;
};

const SegmentsFormContainer = (props: Props, state: State) => {
  const { contentType, id, history } = props;
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState({ byFakeSegment: 0 });

  const {
    loading: segmentDetailQueryLoading,
    error: segmentDetailQueryError,
    data: segmentDetailQueryData
  } = useQuery<SegmentDetailQueryResponse, { _id?: string }>(
    gql(queries.segmentDetail),
    {
      variables: { _id: id },
      fetchPolicy: 'network-only'
    }
  );

  const {
    loading: headSegmentsQueryLoading,
    error: headSegmentsQueryError,
    data: headSegmentsQueryData
  } = useQuery<HeadSegmentsQueryResponse, { contentType: string }>(
    gql(queries.headSegments)
  );

  const {
    loading: combinedFieldsQueryLoading,
    error: combinedFieldsQueryError,
    data: combinedFieldsQueryData
  } = useQuery<FieldsCombinedByTypeQueryResponse, { contentType: string }>(gql(queries.combinedFields), {
    variables: { contentType }
  });

  if (segmentDetailQueryError || headSegmentsQueryError || combinedFieldsQueryError) {
    return <p>Error!</p>;
  }

  if (segmentDetailQueryLoading || headSegmentsQueryLoading || combinedFieldsQueryLoading) {
    return null;
  }

  const fields = (combinedFieldsQueryData ? combinedFieldsQueryData.fieldsCombinedByContentType : []).map(
    ({ name, label, brandName, brandId }) => ({
      _id: name,
      title: label,
      brandName,
      brandId,
      selectedBy: 'none'
    })
  );

  const segment = segmentDetailQueryData ? segmentDetailQueryData.segmentDetail : {} as ISegment;
  const headSegments = headSegmentsQueryData ? headSegmentsQueryData.segmentsGetHeads : [];

  const renderButton = ({
    name,
    values,
    isSubmitted,
    callback,
    object
  }: IButtonMutateProps) => {
    const callBackResponse = () => {
      history.push(`/segments/${contentType}`);

      if (callback) {
        callback();
      }
    };

    return (
      <ButtonMutate
        mutation={object ? mutations.segmentsEdit : mutations.segmentsAdd}
        variables={values}
        callback={callBackResponse}
        refetchQueries={getRefetchQueries(contentType)}
        isSubmitted={isSubmitted}
        btnSize="small"
        type="submit"
        successMessage={`You successfully ${
          object ? 'updated' : 'added'
          } a ${name}`}
      />
    );
  };

  const count = (segmentCount: ISegmentDoc) => {
    setLoading(true)

    let query = companyQueries.companyCounts;

    if (contentType === 'customer') {
      query = customerQueries.customerCounts;
    }

    client
      .query({
        query: gql(query),
        variables: {
          contentType,
          byFakeSegment: segmentCount
        }
      })
      .then(({ data }: any) => {
        setTotal(data[`${contentType}Counts`])
      })
      .catch(e => {
        Alert.error(e.message);
      });

    setLoading(false)
  };

  const updatedProps = {
    ...props,
    fields,
    segment,
    headSegments: headSegments.filter(s => s.contentType === contentType),
    renderButton,
    count,
    counterLoading: loading,
    total
  };

  return <SegmentsForm {...updatedProps} />;
};

const getRefetchQueries = (contentType: string) => {
  return [
    {
      query: gql(generateRefetchQuery({ contentType })),
      variables: { only: 'bySegment' }
    }
  ];
};

const generateRefetchQuery = ({ contentType }) => {
  if (contentType === 'customer') {
    return customerQueries.customerCounts;
  }

  return companyQueries.companyCounts;
};

export default SegmentsFormContainer;