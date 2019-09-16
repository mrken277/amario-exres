import { shallow } from 'enzyme';
import React from 'react';

import { IButtonMutateProps } from 'modules/common/types';
import CompanyForm from '../../../modules/companies/components/list/CompanyForm';

describe('Testing CompanyForm component', () => {
  const defaultProps = {
    renderButton: (props: IButtonMutateProps) => <div>asdf</div>,
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

    closeModal: () => null
  };
  test('renders successfully', () => {
    const wrapper = shallow(<CompanyForm {...defaultProps} />).debug();
    expect(wrapper).not.toBe('');
  });
});
