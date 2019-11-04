import Icon from 'modules/common/components/Icon';
import Customer from 'modules/robot/containers/assistant/Customer';
import * as React from 'react';
import { NotifyItem } from './styles';

type Props = {
  data: any;
};

function MergeEntry(props: Props) {
  const { data } = props;
  const { customerIds = [] } = data;

  return (
    <NotifyItem>
      <Icon icon="cell" />
      <div>
        Merged{' '}
        {customerIds.map(customerId => (
          <Customer key={customerId} id={customerId} />
        ))}
      </div>
    </NotifyItem>
  );
}

export default MergeEntry;
