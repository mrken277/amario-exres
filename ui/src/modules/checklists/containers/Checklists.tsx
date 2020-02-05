import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { IItemParams } from 'modules/boards/types';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import React from 'react';
import { queries } from '../graphql';
import { ChecklistsQueryResponse, IChecklistsParam } from '../types';
import List from './List';

type Props = {
  contentType: string;
  contentTypeId: string;
  stageId: string;
  addItem: (doc: IItemParams, callback: () => void) => void;
};

function ChecklistsContainer(props: Props) {
  const { stageId, addItem, contentType, contentTypeId } = props;

  const {
    loading: checklistsQueryLoading,
    data: checklistsQueryData,
    error: checklistsQueryError
  } = useQuery<ChecklistsQueryResponse, IChecklistsParam>(gql(queries.checklists), {
    variables: {
      contentType,
      contentTypeId
    },
    // refetchQueries: ['checklists'],
  });

  if (checklistsQueryLoading) {
    return <Spinner objective={true} />;
  };

  if (checklistsQueryError) {
    return <ErrorMsg>{checklistsQueryError.message}</ErrorMsg>;
  };

  const checklists = checklistsQueryData ? checklistsQueryData.checklists : [];

  return <>{checklists.map(list => (
    <List
      key={list._id}
      listId={list._id}
      stageId={stageId}
      addItem={addItem}
    />
  ))}</>;
}

export default ChecklistsContainer;