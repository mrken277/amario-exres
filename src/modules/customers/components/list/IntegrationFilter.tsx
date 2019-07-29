import Box from 'modules/common/components/Box';
import DataWithLoader from 'modules/common/components/DataWithLoader';
import { IRouterProps } from 'modules/common/types';
import { __, router } from 'modules/common/utils';
import Wrapper from 'modules/layout/components/Wrapper';
import { SidebarCounter, SidebarList } from 'modules/layout/styles';
import { KIND_CHOICES } from 'modules/settings/integrations/constants';
import React from 'react';
import { withRouter } from 'react-router';

interface IProps extends IRouterProps {
  counts: { [key: string]: number };
  toggleSection: (params: { name: string; isOpen: boolean }) => void;
  config: { [key: string]: boolean };
}

function IntegrationFilter({ history, counts, toggleSection, config }: IProps) {
  const { Section, Header } = Wrapper.Sidebar;

  const onClick = kind => {
    router.setParams(history, { integrationType: kind });
  };

  const data = (
    <SidebarList capitalize={true}>
      {KIND_CHOICES.ALL_LIST.map((kind, index) => (
        <li key={index}>
          <a
            href="#filter"
            tabIndex={0}
            className={
              router.getParam(history, 'integrationType') === kind
                ? 'active'
                : ''
            }
            onClick={onClick.bind(null, kind)}
          >
            {kind === 'facebook' ? 'facebook messenger' : kind}
            <SidebarCounter>{counts[kind]}</SidebarCounter>
          </a>
        </li>
      ))}
    </SidebarList>
  );

  return (
    <Section>
      <Box
        title={__('Filter by integrations')}
        name="showIntegrations"
        isOpen={config.showIntegrations || false}
        toggle={toggleSection}
      >
        <Header uppercase={true}>{__('Filter by integrations')}</Header>

        <DataWithLoader
          data={data}
          loading={false}
          count={KIND_CHOICES.ALL_LIST.length}
          emptyText="No integrations"
          emptyIcon="puzzle"
          size="small"
          objective={true}
        />
      </Box>
    </Section>
  );
}

export default withRouter<IProps>(IntegrationFilter);
