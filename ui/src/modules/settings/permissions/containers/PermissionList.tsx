import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Alert, confirm } from 'modules/common/utils';
import { generatePaginationParams } from 'modules/common/utils/router';
import React from 'react';
import PermissionList from '../components/PermissionList';
import { mutations, queries } from '../graphql';
import {
  IUserGroup,
  PermissionActionsQueryResponse,
  PermissionModulesQueryResponse,
  PermissionRemoveMutationResponse,
  PermissionsQueryResponse,
  PermissionTotalCountQueryResponse,
  UsersGroupsQueryResponse
} from '../types';

type Props = {
  history: any;
  queryParams: any;
};

type FinalProps = {
  can: (action: string) => boolean;
} & Props;

const List = (props: FinalProps) => {
  const { history, queryParams } = props;

  const {
    loading: totalCountQueryLoading,
    error: totalCountQueryError,
    data: totalCountQueryData
  } = useQuery<PermissionTotalCountQueryResponse>(gql(queries.totalCount),
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        module: queryParams.module,
        action: queryParams.action,
        userId: queryParams.userId,
        groupId: queryParams.groupId,
        allowed: queryParams.allowed === 'notAllowed' ? false : true
      }
    }
  );

  const {
    loading: permissionsQueryLoading,
    error: permissionsQueryError,
    data: permissionsQueryData
  } = useQuery<PermissionsQueryResponse>(gql(queries.permissions),
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        module: queryParams.module,
        action: queryParams.action,
        userId: queryParams.userId,
        groupId: queryParams.groupId,
        allowed: queryParams.allowed === 'notAllowed' ? false : true,
        ...generatePaginationParams(queryParams)
      }
    }
  );

  const {
    loading: modulesQueryLoading,
    error: modulesQueryError,
    data: modulesQueryData
  } = useQuery<PermissionModulesQueryResponse>(gql(queries.modules));

  const {
    loading: actionsQueryLoading,
    error: actionsQueryError,
    data: actionsQueryData
  } = useQuery<PermissionActionsQueryResponse>(gql(queries.actions));

  const {
    loading: usersGroupsQueryLoading,
    error: usersGroupsQueryError,
    data: usersGroupsQueryData
  } = useQuery<UsersGroupsQueryResponse>(gql(queries.usersGroups));

  const [removeMutation, { error: permissionRemoveMutationError }] =
    useMutation<PermissionRemoveMutationResponse>(
      gql(mutations.permissionRemove), {
      refetchQueries: commonOptions(queryParams)
    });

  // remove action
  const remove = (id: string) => {
    confirm().then(() => {
      removeMutation({
        variables: { ids: [id] }
      })
        .then(() => {
          Alert.success('You successfully deleted a permission.');
        })
        .catch(error => {
          Alert.error(error.message);
        });
    });
  };

  const isLoading =
    permissionsQueryLoading ||
    modulesQueryLoading ||
    actionsQueryLoading ||
    usersGroupsQueryLoading ||
    totalCountQueryLoading;

  if (totalCountQueryError || permissionsQueryError || modulesQueryError || actionsQueryError || usersGroupsQueryError || permissionRemoveMutationError) {
    return <p>Error!</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const groups = usersGroupsQueryData ? usersGroupsQueryData.usersGroups : [];
  const currentGroup = groups.find(group => queryParams.groupId === group._id) || {} as IUserGroup;

  const updatedProps = {
    ...props,
    queryParams,
    history,
    remove,
    totalCount: totalCountQueryData ? totalCountQueryData.permissionsTotalCount : 0,
    modules: modulesQueryData ? modulesQueryData.permissionModules : [],
    actions: actionsQueryData ? actionsQueryData.permissionActions : [],
    permissions: permissionsQueryData ? permissionsQueryData.permissions : [],
    groups,
    isLoading,
    currentGroupName: currentGroup.name,
    refetchQueries: commonOptions(queryParams)
  };

  return <PermissionList {...updatedProps} />;
};

const commonOptions = queryParams => {
  const variables = {
    module: queryParams.module,
    action: queryParams.action,
    userId: queryParams.userId,
    groupId: queryParams.groupId,
    allowed: queryParams.allowed === 'notAllowed' ? false : true,
    ...generatePaginationParams(queryParams)
  };

  return [
    { query: gql(queries.permissions), variables },
    { query: gql(queries.totalCount), variables }
  ];
};

export default List;
