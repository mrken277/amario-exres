import * as React from 'react';
import { IEntry } from '../../types';
import NotifierItem from './NotiferItem';

type Props = {
  entries: IEntry[];
  action: string;
  markAsNotified: (id: string) => void;
};

class NotifierAction extends React.Component<Props> {
  render() {
    const { entries } = this.props;
    return (
      <>
        {entries.map((entry, index) => {
          if (!entry) {
            return null;
          }

          return <NotifierItem {...this.props} entry={entry} key={index} />;
        })}
      </>
    );
  }
}

export default NotifierAction;
