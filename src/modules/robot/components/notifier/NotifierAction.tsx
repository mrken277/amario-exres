import * as React from 'react';
import { IEntry } from '../../types';
import NotifierItem from './NotiferItem';

type Props = {
  entries: IEntry[];
  action: string;
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

          return (
            <NotifierItem
              delay={index * 100}
              {...this.props}
              entry={entry}
              key={index}
            />
          );
        })}
      </>
    );
  }
}

export default NotifierAction;
