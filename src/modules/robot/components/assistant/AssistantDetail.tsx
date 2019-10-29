import Icon from 'modules/common/components/Icon';
import { IEntry } from 'modules/robot/types';
import * as React from 'react';
import { NavButton, Title } from '../styles';
import { NotifyItem, NotifyList } from './styles';

type Props = {
  datas?: IEntry[];
  changeRoute: (route: string) => void;
  currentAction: string;
};

class AssistantDetail extends React.Component<Props> {
  back = () => {
    this.props.changeRoute('assistant');
  };

  render() {
    return (
      <>
        <NavButton onClick={this.back}>
          <Icon icon="arrow-left" size={24} />
        </NavButton>

        <Title>Customer merge</Title>
        <p>
          Combine real-time client and team communication with in-app messaging,
          live chat, email and form.
        </p>
        <NotifyList>
          <NotifyItem>
            <Icon icon="check-circle" />
            <div>
              Merged <b>Ganzorig</b> and <b>Ganzorig Bayarsaikhan</b>
            </div>
          </NotifyItem>

          <NotifyItem>
            <Icon icon="check-circle" />
            <div>
              Merged <b>Ganzorig</b> and <b>Ganzorig Bayarsaikhan</b>
            </div>
          </NotifyItem>

          <NotifyItem>
            <Icon icon="check-circle" />
            <div>
              Merged <b>Ganzorig</b> and <b>Ganzorig Bayarsaikhan</b>
            </div>
          </NotifyItem>

          <NotifyItem>
            <Icon icon="check-circle" />
            <div>
              Merged <b>Ganzorig</b> and <b>Ganzorig Bayarsaikhan</b>
            </div>
          </NotifyItem>
        </NotifyList>
      </>
    );
  }
}

export default AssistantDetail;
