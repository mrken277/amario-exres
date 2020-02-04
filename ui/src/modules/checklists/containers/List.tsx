import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { IItemParams } from 'modules/boards/types';
import ButtonMutate from 'modules/common/components/ButtonMutate';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import Spinner from 'modules/common/components/Spinner';
import { IButtonMutateProps } from 'modules/common/types';
import { Alert, confirm } from 'modules/common/utils';
import checkError from 'modules/common/utils/checkError';
import React from 'react';
import List from '../components/List';
import { mutations, queries } from '../graphql';
import {
  AddItemMutationResponse,
  IChecklistItemDoc,
  RemoveMutationResponse
} from '../types';

type Props = {
  listId: string;
  stageId: string;
  addItem: (doc: IItemParams, callback: () => void) => void;
};

function ListContainer(props: Props) {
  const { listId, stageId } = props;

  const [
    removeMutation,
    { loading: removeLoading, error: removeError, data: removeData }
  ] = useMutation<RemoveMutationResponse, { _id: string }>(
    gql(mutations.checklistsRemove),
    {
      refetchQueries: ['checklists']
    }
  );

  const [
    addItemMutation,
    { loading: addItemLoading, error: addItemError }
  ] = useMutation<AddItemMutationResponse, IChecklistItemDoc>(
    gql(mutations.checklistItemsAdd),
    {
      refetchQueries: [
        {
          query: gql(queries.checklistDetail),
          variables: {
            _id: props.listId
          }
        }
      ]
    }
  );

  const {
    data: checklistDetailData,
    error: checklistDetailError,
    loading: checklistDetailLoading
  } = useQuery(gql(queries.checklistDetail), {
    variables: {
      _id: listId
    }
  });

  if (checklistDetailLoading || removeLoading || addItemLoading) {
    return <Spinner objective={true} />;
  }

  const item = checklistDetailData && checklistDetailData.checklistDetail;

  if (checklistDetailError || addItemError) {
    const error = checkError([checklistDetailError, addItemError]);

    return <ErrorMsg>{error.message}</ErrorMsg>;
  }

  const removeList = (checklistId: string) => {

    confirm().then(() => {
      removeMutation({ variables: { _id: checklistId } })

      if (removeData) {
        Alert.success('You successfully deleted a checklist');
        localStorage.removeItem(checklistId);
      }

      if (removeError) {
        Alert.error(removeError.message);
      }
    });
  };

  const addItemList = (item: string) => {

    addItemMutation({
      variables: {
        checklistId: listId,
        content: item
      }
    });
  };

  const convertToCardList = (name: string, callback: () => void) => {

    const afterConvert = () => {
      callback();
      Alert.success('You successfully converted a card');
    };

    props.addItem({ stageId, name }, afterConvert);
  };


  const renderButton = ({
    values,
    isSubmitted,
    callback
  }: IButtonMutateProps) => {
    // const callBackResponse = () => {
    //   if (callback) {
    //     callback();
    //   }
    // };

    return (
      <ButtonMutate
        mutation={mutations.checklistsEdit}
        variables={values}
        callback={callback}
        refetchQueries={['checklistDetail']}
        isSubmitted={isSubmitted}
        btnSize="small"
        type="submit"
        icon=""
      />
    );
  };

  const updateprops = {
    item,
    addItem: addItemList,
    renderButton,
    remove: removeList,
    convertToCard: convertToCardList
  };

  return <List {...updateprops} />;
}

export default ListContainer;