import { ITag } from 'modules/tags/types';
import { IActivityLog, IActivityLogForMonth } from '../activityLogs/types';
import { IUser } from '../auth/types';

export interface ICarLinks {
  linkedIn?: string;
  twitter?: string;
  facebook?: string;
  github?: string;
  youtube?: string;
  website?: string;
}

export interface ICarDoc {
  createdAt?: Date;
  modifiedAt?: Date;
  avatar?: string;

  primaryName?: string;
  names?: string[];
  size?: number;
  industry?: string;
  website?: string;
  plan?: string;
  state?: string;
  parentCarId?: string;

  ownerId?: string;

  emails?: string[];
  primaryEmail?: string;

  primaryPhone?: string;
  phones?: string[];

  businessType?: string;
  description?: string;
  employees?: number;
  doNotDisturb?: string;
  links: ICarLinks;
  tagIds?: string[];
  customFieldsData?: any;
  code?: string;
}

export interface IActivityLogYearMonthDoc {
  year: number;
  month: number;
}

export interface ICarActivityLog {
  date: IActivityLogYearMonthDoc;
  list: IActivityLog[];
}

export interface ICar extends ICarDoc {
  _id: string;
  owner: IUser;
  getTags: ITag[];
}

// mutation types

export type EditMutationResponse = {
  carsEdit: (params: { variables: ICar }) => Promise<any>;
};

export type RemoveMutationVariables = {
  carIds: string[];
};

export type RemoveMutationResponse = {
  carsRemove: (params: { variables: RemoveMutationVariables }) => Promise<any>;
};

export type MergeMutationVariables = {
  carIds: string[];
  carFields: any;
};

export type MergeMutationResponse = {
  carsMerge: (params: { variables: MergeMutationVariables }) => Promise<any>;
};

export type AddMutationResponse = {
  carsAdd: (params: { variables: ICarDoc }) => Promise<any>;
};

// query types

export type ListQueryVariables = {
  page?: number;
  perPage?: number;
  segment?: string;
  tag?: string;
  brand?: string;
  ids?: string[];
  searchValue?: string;
  sortField?: string;
  sortDirection?: number;
};

type ListConfig = {
  name: string;
  label: string;
  order: number;
};

export type MainQueryResponse = {
  carsMain: { list: ICar[]; totalCount: number };
  loading: boolean;
  refetch: () => void;
};

export type CarsQueryResponse = {
  cars: ICar[];
  loading: boolean;
  refetch: () => void;
};

export type ListConfigQueryResponse = {
  fieldsDefaultColumnsConfig: ListConfig[];
  loading: boolean;
};

export type DetailQueryResponse = {
  carDetail: ICar;
  loading: boolean;
};

export type ActivityLogQueryResponse = {
  activityLogs: IActivityLogForMonth[];
  loading: boolean;
};

type Count = {
  [key: string]: number;
};

type CarCounts = {
  bySegment: Count;
  byTag: Count;
  byBrand: Count;
  byLeadStatus: Count;
};

export type CountQueryResponse = {
  carCounts: CarCounts;
  loading: boolean;
  refetch: () => void;
};
