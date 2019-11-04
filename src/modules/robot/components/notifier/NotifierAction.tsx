import * as React from 'react';
import { IEntry } from '../../types';
import NotifierItem from './NotiferItem';

type Props = {
  entries: IEntry[];
  action: string;
  markAsNotified: (id: string) => void;
  iteration: number;
};

function NotifierAction(props: Props) {
  const { entries, iteration } = props;

  return (
    <>
      {entries.map((entry, index) => {
        if (!entry) {
          return null;
        }

        return (
          <NotifierItem
            {...props}
            delay={4000 + iteration * 600}
            entry={entry}
            key={index}
          />
        );
      })}
    </>
  );
}

export default NotifierAction;
