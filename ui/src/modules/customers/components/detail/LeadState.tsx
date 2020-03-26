import Icon from 'modules/common/components/Icon';
import { LEAD_CHOICES } from 'modules/customers/constants';
import { LeadStateWrapper, StateItem } from 'modules/customers/styles';
import { ICustomer } from 'modules/customers/types';
import React from 'react';

class LeadState extends React.Component<
  { customer: ICustomer },
  { currentState: number }
> {
  constructor(props) {
    super(props);

    this.state = { currentState: 0 };
  }

  render() {
    const { customer } = this.props;
    const { currentState } = this.state;

    if (customer.state !== 'lead') {
      return null;
    }

    return (
      <LeadStateWrapper>
        {LEAD_CHOICES.map((data, index) => {
          const onClick = () => {
            this.setState({ currentState: index });
          };

          return (
            <StateItem
              key={data.name}
              past={index < currentState}
              active={index === currentState}
              onClick={onClick}
            >
              <div>
                {index < currentState && <Icon icon="check-1" size={16} />}
                {data.name}
                {data.time && <span> {data.time}</span>}
              </div>
            </StateItem>
          );
        })}
      </LeadStateWrapper>
    );
  }
}

export default LeadState;
