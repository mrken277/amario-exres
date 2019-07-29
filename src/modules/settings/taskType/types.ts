export interface ITaskType {
  _id: string;
  name: string;
  icon: string;
}

// query types

export type TaskTypeQueryResponse = {
  taskTypes: ITaskType[];
  loading: boolean;
  refetch: () => void;
};

export type MutationVariables = {
  _id?: string;
  name?: string;
  icon?: string;
};

// mutation types

export type AddMutationResponse = {
  addMutation: (mutation: { variables: MutationVariables }) => Promise<any>;
};

export type EditMutationResponse = {
  editMutation: (mutation: { variables: MutationVariables }) => Promise<any>;
};

export type RemoveMutationResponse = {
  removeMutation: (mutation: { variables: { _id: string } }) => Promise<any>;
};
