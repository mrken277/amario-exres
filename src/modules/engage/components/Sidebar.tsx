import Box from 'modules/common/components/Box';
import CountsByTag from 'modules/common/components/CountsByTag';
import { __, router } from 'modules/common/utils';
import Wrapper from 'modules/layout/components/Wrapper';
import { SidebarCounter, SidebarList } from 'modules/layout/styles';
import { ITag } from 'modules/tags/types';
import React from 'react';
import { Link } from 'react-router-dom';
import { MESSAGE_KIND_FILTERS, statusFilters } from '../constants';

const { Section } = Wrapper.Sidebar;

type Props = {
  kindCounts: any;
  statusCounts: any;
  tagCounts: any;
  tags: ITag[];
  history?: any;
  toggleSection: (params: { name: string; isOpen: boolean }) => void;
  config: { [key: string]: boolean };
};

class Sidebar extends React.Component<Props> {
  renderKindFilter() {
    const { kindCounts, history } = this.props;

    return (
      <Section>
        <Section.Title>{__('Kind')}</Section.Title>

        <SidebarList>
          <li>
            <Link to="/engage">
              {__('All')}
              <SidebarCounter>{kindCounts.all}</SidebarCounter>
            </Link>
          </li>

          {MESSAGE_KIND_FILTERS.map((kind, index) => (
            <li key={index}>
              <Link
                tabIndex={0}
                className={
                  router.getParam(history, 'kind') === kind.name ? 'active' : ''
                }
                to={`/engage?kind=${kind.name}`}
              >
                {__(kind.text)}
                <SidebarCounter>{kindCounts[kind.name]}</SidebarCounter>
              </Link>
            </li>
          ))}
        </SidebarList>
      </Section>
    );
  }

  renderStatusFilter() {
    const { statusCounts, history } = this.props;

    return (
      <Section>
        <Section.Title>{__('Status')}</Section.Title>

        <SidebarList>
          {statusFilters.map((status, index) => (
            <li key={index}>
              <Link
                tabIndex={0}
                className={
                  router.getParam(history, 'status') === status.key
                    ? 'active'
                    : ''
                }
                to={`/engage?status=${status.key}`}
              >
                {__(status.value)}
                <SidebarCounter>{statusCounts[status.key]}</SidebarCounter>
              </Link>
            </li>
          ))}
        </SidebarList>
      </Section>
    );
  }

  render() {
    const { tags, tagCounts, config, toggleSection } = this.props;

    return (
      <Wrapper.Sidebar>
        <Box
          title={__('Kind')}
          name="showKinds"
          isOpen={config.showKinds || false}
          toggle={toggleSection}
        >
          {this.renderKindFilter()}
        </Box>
        <Box
          title={__('Status')}
          name="showStatus"
          isOpen={config.showStatus || false}
          toggle={toggleSection}
        >
          {this.renderStatusFilter()}
        </Box>
        <Box
          title={__('Filter by tags')}
          name="showFilter"
          isOpen={config.showFilter || false}
          toggle={toggleSection}
        >
          <CountsByTag
            tags={tags}
            manageUrl="tags/engageMessage"
            counts={tagCounts}
            loading={false}
          />
        </Box>
      </Wrapper.Sidebar>
    );
  }
}

export default Sidebar;
