import { useMutation, useQuery } from '@apollo/react-hooks';
import { AppConsumer } from 'appContext';
import gql from 'graphql-tag';
import { IRouterProps } from 'modules/common/types';
import { Alert, router } from 'modules/common/utils';
import { generatePaginationParams } from 'modules/common/utils/router';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import Histories from '../components/Histories';
import { mutations, queries } from '../graphql';
import { IImportHistoryItem, ImportHistoriesQueryResponse, RemoveMutationResponse } from '../types';

type Props = {
  queryParams: any;
  showLoadingBar: (isRemovingImport: boolean) => void;
  closeLoadingBar: () => void;
  isDoneIndicatorAction: boolean;
} & IRouterProps;

const HistoriesContainer = (props: Props) => {
  const [loading] = useState(false);
  const { isDoneIndicatorAction, queryParams, closeLoadingBar, showLoadingBar, history } = props;

  const {
    loading: historiesQueryLoading,
    error: historiesQueryError,
    data: historiesQueryData,
    refetch: historiesQueryRefetch
  } = useQuery<ImportHistoriesQueryResponse, { type: string }>(
    gql(queries.histories),
    {
      variables: {
        ...generatePaginationParams(queryParams),
        type: queryParams.type || 'customer'
      },
      fetchPolicy: 'network-only'
    }
  );

  const [importHistoriesRemove, { error: importHistoriesRemoveError }] =
    useMutation<RemoveMutationResponse, { _id: string }>(
      gql(mutations.importHistoriesRemove), {
      refetchQueries: ['importHistories']
    });

  useEffect(() => {
    historiesQueryRefetch()
  }, [isDoneIndicatorAction]);

  if (historiesQueryError || importHistoriesRemoveError) {
    return <p>Error!</p>;
  }

  if (historiesQueryLoading) {
    return <p>Loading...</p>;
  }

  if (!router.getParam(history, 'type')) {
    router.setParams(history, { type: 'customer' }, true);
  }

  const currentType = router.getParam(history, 'type');

  const removeHistory = historyId => {
    // reset top indicator
    closeLoadingBar();

    localStorage.setItem('erxes_import_data', historyId);
    localStorage.setItem('erxes_import_data_type', 'remove');

    showLoadingBar(true);

    importHistoriesRemove({
      variables: { _id: historyId }
    })
      .then(() => {
        historiesQueryRefetch();
      })
      .catch(e => {
        Alert.error(e.message);
        closeLoadingBar();
      });
  };

  const histories = historiesQueryData ? historiesQueryData.importHistories : {} as IImportHistoryItem;

  const updatedProps = {
    ...props,
    histories: histories.list || [],
    loading: historiesQueryLoading || loading,
    removeHistory,
    currentType,
    totalCount: histories.count || 0
  };

  return <Histories {...updatedProps} />;
}

const WithConsumer = props => {
  return (
    <AppConsumer>
      {({ showLoadingBar, closeLoadingBar, isDoneIndicatorAction }) => (
        <HistoriesContainer
          {...props}
          showLoadingBar={showLoadingBar}
          closeLoadingBar={closeLoadingBar}
          isDoneIndicatorAction={isDoneIndicatorAction}
        />
      )}
    </AppConsumer>
  );
};

export default withRouter<IRouterProps>(WithConsumer);
