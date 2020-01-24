import { useMutation, useQuery } from '@apollo/react-hooks';
import { AppConsumer } from 'appContext';
import gql from 'graphql-tag';
import { router } from 'modules/common/utils';
import { generatePaginationParams } from 'modules/common/utils/router';
import React, { useState } from 'react';
import Histories from '../components/Histories';
import { mutations, queries } from '../graphql';
import { IImportHistoryItem, ImportHistoriesQueryResponse, RemoveMutationResponse } from '../types';

type Props = {
  queryParams: any;
  showLoadingBar: (isRemovingImport: boolean) => void;
  closeLoadingBar: () => void;
  isDoneIndicatorAction: boolean;
  history?: any;
};

type State = {
  loading: boolean;
};

export const HistoriesContainer = (props: Props, state: State) => {
  const {
    history,
    queryParams,
    showLoadingBar,
    closeLoadingBar
  } = props;
  const [loading] = useState(false);

  const {
    loading: historiesQueryLoading,
    error: historiesQueryError,
    data: historiesQueryData
  } = useQuery<ImportHistoriesQueryResponse, { type: string }>(
    gql(queries.histories),
    {
      variables: historiesListParams(queryParams),
      fetchPolicy: 'network-only'
    }
  );

  const [removeMutation, { error: importHistoriesRemoveMutationError }] =
    useMutation<RemoveMutationResponse, { _id: string }>(
      gql(mutations.importHistoriesRemove), {
      refetchQueries: [{
        query: gql(queries.histories),
        variables: historiesListParams(queryParams)
      }]
    });

  // componentDidUpdate(prevProps: FinalProps) {
  //   if (this.props.isDoneIndicatorAction !== prevProps.isDoneIndicatorAction) {
  //     this.props.historiesQuery.refetch();
  //   }
  // }

  if (historiesQueryError || importHistoriesRemoveMutationError) {
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

    removeMutation({
      variables: { _id: historyId }
    })
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

const historiesListParams = queryParams => ({
  ...generatePaginationParams(queryParams),
  type: queryParams.type || 'customer'
});

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

export default WithConsumer;
