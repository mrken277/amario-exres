import { Popover } from 'modules/common/styles/main';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { PopoverContent } from '../styles';

class ActionGroup extends React.Component<{}> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <PopoverContent>
        <div>
          <Link to="/deal">Go deal</Link>
        </div>
      </PopoverContent>
    );
  }
}

export default ActionGroup;
