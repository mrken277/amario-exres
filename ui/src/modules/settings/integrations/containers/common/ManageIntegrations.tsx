import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { IBrandDoc } from 'modules/settings/brands/types';
import { IChannelDoc } from 'modules/settings/channels/types';
import ManageIntegrations from 'modules/settings/integrations/components/common/ManageIntegrations';
import { queries } from 'modules/settings/integrations/graphql';
import React, { useState } from 'react';
import { IntegrationsQueryResponse } from '../../types';

type Props = {
  current: IChannelDoc | IBrandDoc;
  save: (ids: string[]) => Promise<any>;
  closeModal?: () => void;
};

const SegmentListContainer = (props: Props, state: { perPage: number }) => {
  const [perPage, setPerPage] = useState(20);

  const { save } = props;

  const {
    loading: integrationsQueryLoading,
    error: integrationsQueryError,
    data: integrationsQueryData
  } = useQuery<IntegrationsQueryResponse, { perPage: number }>(
    gql(queries.integrations),
    {
      variables: { perPage: 20 },
      fetchPolicy: 'network-only'
    }
  );

  const search = (value, loadmore) => {
    if (!loadmore) {
      setPerPage(0)
    }

    setPerPage(perPage + 20);

    // this.setState({ perPage: this.state.perPage + 20 }, () => {
    //   allIntegrationsQuery.refetch({
    //     searchValue: value,
    //     perPage: this.state.perPage
    //   });
    // });
  };

  if (integrationsQueryError) {
    return <p>Error!</p>;
  }

  if (integrationsQueryLoading) {
    return <p>Loading...</p>;
  }

  const updatedProps = {
    ...props,
    search,
    save,
    perPage,
    allIntegrations: integrationsQueryData ? integrationsQueryData.integrations : []
  };

  return <ManageIntegrations {...updatedProps} />;
}

export default SegmentListContainer;