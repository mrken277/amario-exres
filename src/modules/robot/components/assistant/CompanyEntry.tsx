import Icon from 'modules/common/components/Icon';
import Company from 'modules/robot/containers/assistant/Company';
import { IEntry } from 'modules/robot/types';
import * as React from 'react';
import { NotifyItem } from './styles';

type Props = {
  entries: IEntry[];
};

function CompanyEntry(props: Props) {
  const { entries } = props;

  return entries.map((entry, index) => {
    const { data } = entry;
    const modifier = data.modifier;
    const items = Object.keys(modifier);

    return (
      <div key={index}>
        <Company id={data._id} />
        {items.map(key => {
          return (
            <NotifyItem key={key}>
              <Icon icon="info-circle" />
              <div>
                <b>{key}</b>: <span>{modifier[key]}</span>
              </div>
            </NotifyItem>
          );
        })}
      </div>
    );
  });
}

export default CompanyEntry;
