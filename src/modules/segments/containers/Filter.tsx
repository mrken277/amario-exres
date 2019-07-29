import gql from 'graphql-tag';
import { IRouterProps } from 'modules/common/types';
import { router, withProps } from 'modules/common/utils';
import { getConfig, setConfig } from 'modules/inbox/utils';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import Filter from '../components/Filter';
import { queries } from '../graphql';
import { Counts, SegmentsQueryResponse } from '../types';

type Props = {
  contentType: string;
  counts: Counts;
};

type FinalProps = {
  segmentsQuery: SegmentsQueryResponse;
} & Props &
  IRouterProps;

const STORAGE_KEY = `erxes_sidebar_section_config`;

const FilterContainer = (props: FinalProps) => {
  const { segmentsQuery, history } = props;

  const currentSegment = router.getParam(history, 'segment');

  const toggleSection = ({
    name,
    isOpen
  }: {
    name: string;
    isOpen: boolean;
  }) => {
    // const customerId = this.props.conversation.customerId;
    const config = getConfig(STORAGE_KEY);

    config[name] = isOpen;

    setConfig(STORAGE_KEY, config);

    // this.getCustomerDetail(customerId);
  };

  const setSegment = segment => {
    router.setParams(history, { segment });
  };

  const removeSegment = () => {
    router.removeParams(history, 'segment');
  };

  const extendedProps = {
    ...props,
    currentSegment,
    setSegment,
    removeSegment,
    segments: segmentsQuery.segments || [],
    loading: segmentsQuery.loading,
    toggleSection,
    config: getConfig(STORAGE_KEY)
  };

  return <Filter {...extendedProps} />;
};

export default withProps<Props>(
  compose(
    graphql(gql(queries.segments), {
      name: 'segmentsQuery',
      options: ({ contentType }: { contentType: string }) => ({
        variables: { contentType }
      })
    })
  )(withRouter<FinalProps>(FilterContainer))
);
