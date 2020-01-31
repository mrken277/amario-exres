import { useMutation, useQuery } from '@apollo/react-hooks';
import { AppConsumer } from 'appContext';
import gql from 'graphql-tag';
import { Alert, confirm } from 'modules/common/utils';
import React, { useEffect, useState } from 'react';
import ImportIndicator from '../components/ImportIndicator';
import { mutations, queries, subscriptions } from '../graphql';
import {
  CancelMutationResponse,
  IImportHistory,
  ImportHistoryDetailQueryResponse
} from '../types';

const subscription = gql(subscriptions.importSubscription);

type Props = {
  id: string;
  close: () => void;
  importHistoryDetailQuery: ImportHistoryDetailQueryResponse;
  closeLoadingBar: () => void;
  doneIndicatorAction: () => void;
  isRemovingImport: boolean;
};

const ImportIndicatorContainer = (props: Props) => {
  const [percentageState, setPercentage] = useState(0);
  const [errors, setErrors] = useState([])

  const { id, closeLoadingBar, isRemovingImport, doneIndicatorAction } = props;

  const {
    loading: importHistoryDetailQueryLoading,
    error: importHistoryDetailQueryError,
    data: importHistoryDetailQueryData,
    refetch: importHistoryDetailQueryRefetch,
    subscribeToMore
  } = useQuery(gql(queries.historyDetailForLoad),
    {
      fetchPolicy: 'network-only',
      variables: { _id: id },
      pollInterval: 20000
    }
  );

  const [importCancel, { error: importCancelMutationError }] =
    useMutation<CancelMutationResponse, { _id: string }>(
      gql(mutations.importCancel));

  const clearStorage = () => {
    // clear local storage
    localStorage.setItem('erxes_import_data', '');
    localStorage.setItem('erxes_import_data_type', '');
  }

  useEffect(() => {
    subscribeToMore({
      document: subscription,
      variables: { _id: id },
      updateQuery: (prev, { subscriptionData: { data } }) => {
        const { importHistoryChanged } = data;
        const { percentage, status, errorMsgs } = importHistoryChanged;

        if (status === 'Error') {
          clearStorage();

          return setErrors(errorMsgs);
        }

        if (status === 'Removed') {
          clearStorage();

          // for refetch list
          doneIndicatorAction();
        }

        if (status === 'Done') {
          clearStorage();

          return importHistoryDetailQueryRefetch();
        }

        if (percentage.toFixed(0) !== percentageState) {
          setPercentage(percentage.toFixed(0))
        }
      }
    });
  })

  if (importHistoryDetailQueryError || importCancelMutationError) {
    return <p>Error!</p>;
  }

  if (importHistoryDetailQueryLoading) {
    return <p>Loading...</p>;
  }

  const importHistory = importHistoryDetailQueryData ? importHistoryDetailQueryData.importHistoryDetail : {} as IImportHistory;

  const percentageNum =
    Math.trunc(importHistory.percentage) || percentageState;

  const cancelImport = importId => {
    confirm().then(() => {
      importCancel({
        variables: { _id: importId }
      })
        .then(() => {
          Alert.success('You canceled importing action.');
          closeLoadingBar();
        })
        .catch(e => {
          Alert.error(e.message);
          closeLoadingBar();
        });
    });
  };

  return (
    <ImportIndicator
      {...props}
      percentage={percentageNum}
      importHistory={importHistory}
      cancel={cancelImport}
      isRemovingImport={isRemovingImport}
      errors={errors}
    />
  );
}

const WithConsumer = props => {
  return (
    <AppConsumer>
      {({ closeLoadingBar, isRemovingImport, doneIndicatorAction }) => (
        <ImportIndicatorContainer
          {...props}
          closeLoadingBar={closeLoadingBar}
          isRemovingImport={isRemovingImport}
          doneIndicatorAction={doneIndicatorAction}
        />
      )}
    </AppConsumer>
  );
};

export default WithConsumer;
