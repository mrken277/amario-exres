import ConvertTrigger from 'modules/boards/components/portable/ConvertTrigger';
import React from 'react';
import options from '../options';

type Props = {
  relType: string;
  relTypeIds?: string[];
  assignedUserIds?: string[];
  sourceIntegration?: string;
  sourceIntegrationId?: string;
  sourceConversationId?: string;
  url?: string;
  refetch?: () => void;
};

export default (props: Props) => {
  const title = props.url ? 'View a deal' : 'Convert to a deal';

  const extendedProps = {
    ...props,
    options,
    title
  };

  return <ConvertTrigger {...extendedProps} />;
};
