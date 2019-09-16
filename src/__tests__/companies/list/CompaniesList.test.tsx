import { shallow } from 'enzyme';
import React from 'react';

import CompaniesList from 'modules/companies/containers/CompaniesList';
import { ICompany } from 'modules/companies/types';

describe('Testing CompaniesList component', () => {
  const defaultProps = {
    company: [
      {
        _id: 'asdf1223',
        owner: {
          _id: 'asd12',
          hasSeenOnBoard: true,
          username: 'anand',
          email: 'asd2@gmail.com'
        },
        getTags: [
          {
            _id: 'string',
            type: 'default',
            name: 'box',
            colorCode: '#fffff'
          }
        ],
        links: {
          website: 'google.com'
        }
      }
    ],
    columnsConfig: [
      {
        name: 'string',
        label: 'div',
        order: 'ord'
      }
    ],
    loading: true,
    searchValue: true,
    totalCount: 5,
    // TODO: check is below line not throwing error ?
    toggleBulk: () => null,
    toggleAll: (targets: ICompany[], containerId: string) => null,
    bulk: [{}],
    isAllSelected: true,
    emptyBulk: () => null,
    removeCompanies: (doc: { companyIds: string[] }, emptyBulk: () => void) =>
      null,
    mergeCompanies: () => null,
    queryParams: [],
    exportCompanies: (bulk: string[]) => null
  };
  test('renders successfully', () => {
    const wrapper = shallow(<CompaniesList {...defaultProps} />).debug();
    expect(wrapper).not.toBe('');
  });
});
