import { getConstantFromStore } from 'modules/common/utils';

export const CAR_INFO = {
  avatar: 'Logo',
  primaryName: 'Primary Name',
  size: 'Size',
  industry: 'Industry',
  plan: 'Plan',
  primaryEmail: 'Primary Email',
  primaryPhone: 'Primary Phone',
  businessType: 'Business Type',
  description: 'Description',
  doNotDisturb: 'Do not disturb',

  ALL: [
    { field: 'avatar', label: 'Logo' },
    { field: 'primaryName', label: 'Primary Name' },
    { field: 'size', label: 'Size' },
    { field: 'industry', label: 'Industry' },
    { field: 'plan', label: 'Plan' },
    { field: 'primaryEmail', label: 'Primary Email' },
    { field: 'primaryPhone', label: 'Primary Phone' },
    { field: 'businessType', label: 'Business Type' },
    { field: 'description', label: 'Description' },
    { field: 'doNotDisturb', label: 'Do not disturb' }
  ]
};

export const CAR_LINKS = {
  linkedIn: 'LinkedIn',
  twitter: 'Twitter',
  facebook: 'Facebook',
  youtube: 'Youtube',
  github: 'Github',
  website: 'Website',

  ALL: [
    { field: 'linkedIn', label: 'LinkedIn' },
    { field: 'twitter', label: 'Twitter' },
    { field: 'facebook', label: 'Facebook' },
    { field: 'youtube', label: 'Youtube' },
    { field: 'github', label: 'Github' },
    { field: 'website', label: 'Website' }
  ]
};

export const CAR_DATAS = {
  owner: 'Owner',
  parentCar: 'Parent Car',
  links: 'Links',

  ALL: [
    { field: 'owner', label: 'Owner' },
    { field: 'parentCar', label: 'Parent Car' },
    { field: 'links', label: 'Links' }
  ]
};

export const CAR_INDUSTRY_TYPES = () => {
  return getConstantFromStore('car_industry_types', false, true);
};

export const CAR_BUSINESS_TYPES = [
  'Competitor',
  'Customer',
  'Investor',
  'Partner',
  'Press',
  'Prospect',
  'Reseller',
  'Other'
];
