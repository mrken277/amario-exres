import { shallow } from 'enzyme';
import React from 'react';

import CompanyRow from '../../../modules/companies/components/list/CompanyRow';
import { ICompany } from '../../../modules/companies/types';

describe('Testing CompanyRow component', () => {
  const defaultProps = {
    company: {
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
    },
    columnsConfig: ['Config'],
    history: 'startup',
    isChecked: true,
    toggleBulk: (company: ICompany, isChecked?: boolean) => null
  };

  test('renders successfully', () => {
    const wrapper = shallow(<CompanyRow {...defaultProps} />).debug();

    expect(wrapper).not.toBe('');
  });
});
