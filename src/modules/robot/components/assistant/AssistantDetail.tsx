import Icon from 'modules/common/components/Icon';
import { __ } from 'modules/common/utils';
import CompanyEntry from 'modules/robot/containers/assistant/CompanyEntry';
import { IEntry } from 'modules/robot/types';
import * as React from 'react';
import { ContentWrapper, NavButton, Title } from '../styles';
import MergeEntry from './MergeEntry';
import ScoreEntry from './ScoreEntry';
import { NotifyList } from './styles';

type Props = {
  datas?: IEntry[];
  changeRoute: (route: string) => void;
  currentAction: string;
};

class AssistantDetail extends React.Component<Props> {
  renderContent = () => {
    const { currentAction, datas = [] } = this.props;

    if (currentAction === 'mergeCustomers') {
      return (
        <>
          <Title>{__('Customer merge')}</Title>
          <p>
            {__(
              'We recognize the same person contacted from different channels and ask you to merge their communications into one conversation'
            )}
          </p>
          <NotifyList>
            {datas.map(item => (
              <MergeEntry key={item._id} data={item.data} />
            ))}
          </NotifyList>
        </>
      );
    }

    if (currentAction === 'customerScoring') {
      return (
        <>
          <Title>{__('Customer score')}</Title>
          <p>
            {__(
              'Customer score measured by platform usage activity and amount of data entered by the customer'
            )}
          </p>
          <NotifyList>
            {datas.map(item => (
              <ScoreEntry key={item._id} data={item.data} />
            ))}
          </NotifyList>
        </>
      );
    }

    if (currentAction === 'fillCompanyInfo') {
      return (
        <>
          <Title>{__('Fill company info')}</Title>
          <p>
            {__(
              "Fill out company information and you'll see the updated company information below"
            )}
          </p>
          <NotifyList>
            {datas.map(item => (
              <CompanyEntry
                key={item._id}
                parentId={item._id}
                action={item.action}
              />
            ))}
          </NotifyList>
        </>
      );
    }

    return null;
  };

  back = () => {
    this.props.changeRoute('assistant');
  };

  render() {
    return (
      <ContentWrapper>
        <NavButton onClick={this.back}>
          <Icon icon="arrow-left" size={24} />
        </NavButton>
        {this.renderContent()}
      </ContentWrapper>
    );
  }
}

export default AssistantDetail;
