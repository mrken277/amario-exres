import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import HistoryDetail from '../components/HistoryDetail';
import { queries, subscriptions } from '../graphql';
import { IImportHistory } from '../types';

const subscription = gql(subscriptions.importSubscription);

const HistoryDetailContainer = (props: { id: string }) => {
  const [percentageState, setPercentage] = useState(0);
  const { id } = props;

  const {
    loading: importHistoryDetailLoading,
    error: importHistoryDetailError,
    data: importHistoryDetailData,
    refetch: importHistoryDetailRefetch,
    subscribeToMore
  } = useQuery(gql(queries.historyDetail),
    {
      fetchPolicy: 'network-only',
      variables: { _id: id },
      pollInterval: 20000
    }
  );

  useEffect(() => {
    subscribeToMore({
      document: subscription,
      variables: { _id: id },

      updateQuery: (prev, { subscriptionData: { data } }) => {
        const { importHistoryChanged } = data;
        const { percentage, status } = importHistoryChanged;

        if (status === 'Done') {
          return importHistoryDetailRefetch()
        }

        if (percentage.toFixed(0) !== percentageState) {
          setPercentage(percentage.toFixed(0));
        }

        return null;
      }
    })
  })

  if (importHistoryDetailError) {
    return <p>Error!</p>;
  }

  if (importHistoryDetailLoading) {
    return <p>Loading...</p>;
  }

  const importHistory = importHistoryDetailData ? importHistoryDetailData.importHistoryDetail : {} as IImportHistory;

  const percentageNum =
    Math.trunc(importHistory.percentage) || percentageState;

  return (
    <HistoryDetail
      importHistory={importHistory}
      loading={importHistoryDetailLoading}
      percentage={percentageNum}
    />
  );
}

export default HistoryDetailContainer;