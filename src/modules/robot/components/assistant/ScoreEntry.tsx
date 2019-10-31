import Icon from 'modules/common/components/Icon';
import Customer from 'modules/robot/containers/assistant/Customer';
import * as React from 'react';
import { NotifyItem } from './styles';

type Props = {
  data: any;
};

class ScoreEntry extends React.Component<Props> {
  render() {
    const { data } = this.props;
    const { scoreMap = [] } = data;

    return (
      <NotifyItem>
        <Icon icon="award" />
        <div>
          {scoreMap.map(item => {
            return (
              <div key={item._id}>
                <Customer id={item._id} /> scored <b>{item.score}</b>
              </div>
            );
          })}
        </div>
      </NotifyItem>
    );
  }
}

export default ScoreEntry;
