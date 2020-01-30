import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ErrorMsg from 'modules/common/components/ErrorMsg';
import checkError from 'modules/common/utils/checkError';
import React from 'react';
import Item from '../components/Item';
import { mutations, queries } from '../graphql';
import {
  EditItemMutationResponse,
  EditItemMutationVariables,
  IChecklistItem,
  RemoveItemMutationResponse
} from '../types';

type Props = {
  item: IChecklistItem;
  convertToCard: (name: string, callback: () => void) => void;
};

function ItemContainer(props: Props) {
  const { item } = props;

  const [
    editItemMutation,
    { error: editItemError }
  ] = useMutation<EditItemMutationResponse, EditItemMutationVariables>(
    gql(mutations.checklistItemsEdit),
    {
      refetchQueries: [
        {
          query: gql(queries.checklistDetail),
          variables: {
            _id: item.checklistId
          }
        }
      ]
    }
  );

  const [
    removeItemMutation,
    { error: removeItemError }
  ] = useMutation<RemoveItemMutationResponse, { _id: string }>(
    gql(mutations.checklistItemsRemove),
    {
      refetchQueries: [
        {
          query: gql(queries.checklistDetail),
          variables: {
            _id: item.checklistId
          }
        }
      ]
    }
  );

  if (removeItemError || editItemError) {
    const error = checkError([removeItemError, editItemError]);

    return <ErrorMsg>{error.message}</ErrorMsg>;
  }

  const editItem = (
    doc: {
      content: string; isChecked: boolean;
    },
    callback?: () => void
  ) => {
    editItemMutation({
      variables: {
        ...doc,
        _id: item._id,
        checklistId: item.checklistId
      }
    }).then(() => {
      if (callback) {
        callback();
      }
    });
  };

  const removeItem = (checklistItemId: string) => {
    removeItemMutation({ variables: { _id: checklistItemId } });
  };

  const extendedProps = {
    ...props,
    item,
    editItem,
    removeItem
  };

  return <Item {...extendedProps} />;
}

export default ItemContainer;
