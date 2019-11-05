import dayjs from 'dayjs';
import {
  ActivityContent,
  ActivityDate,
  ActivityIcon,
  ActivityRow,
  AvatarWrapper,
  FlexBody,
  FlexContent
} from 'modules/activityLogs/styles';
import Icon from 'modules/common/components/Icon';
import NameCard from 'modules/common/components/nameCard/NameCard';
import Tip from 'modules/common/components/Tip';
import { IInternalNote } from 'modules/internalNotes/types';
import React from 'react';
import xss from 'xss';

type Props = {
  activity: any;
  internalNote: IInternalNote;
};

class InternalNote extends React.Component<Props> {
  render() {
    const { internalNote, activity } = this.props;

    const { content } = internalNote;

    return (
      <ActivityRow key={Math.random()}>
        <ActivityIcon color={'#F7CE53'}>
          <Icon icon={'clipboard-notes'} />
        </ActivityIcon>
        <React.Fragment>
          <FlexContent>
            <AvatarWrapper>
              <NameCard.Avatar />
            </AvatarWrapper>
            <FlexBody> asdajkdljlkjkl</FlexBody>
            <Tip text={dayjs(activity.createdAt).format('llll')}>
              <ActivityDate>
                {dayjs(activity.createdAt).format('MMM D, h:mm A')}
              </ActivityDate>
            </Tip>
          </FlexContent>
          <ActivityContent
            isInternalNote={true}
            dangerouslySetInnerHTML={{ __html: xss(content) }}
          />
        </React.Fragment>
      </ActivityRow>
    );
  }
}

export default InternalNote;
