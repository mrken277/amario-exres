import Box from 'modules/common/components/Box';
import FilterByParams from 'modules/common/components/FilterByParams';
import Icon from 'modules/common/components/Icon';
import { __, router } from 'modules/common/utils';
import Wrapper from 'modules/layout/components/Wrapper';
import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { IRouterProps } from '../../common/types';
import { ITag } from '../../tags/types';

interface IProps extends IRouterProps {
  tags: ITag[];
  counts: any;
  manageUrl: string;
  loading: boolean;
  toggleSection: (params: { name: string; isOpen: boolean }) => void;
  config: { [key: string]: boolean };
}

function CountsByTag({
  history,
  tags,
  counts,
  manageUrl,
  loading,
  config,
  toggleSection
}: IProps) {
  const { Section } = Wrapper.Sidebar;

  const onClick = () => {
    router.setParams(history, { tag: null });
  };

  return (
    <Section collapsible={tags.length > 5}>
      <Box
        title={__('Filter by tags')}
        name="showTags"
        isOpen={config.showTags || false}
        toggle={toggleSection}
      >
        <Section.Title>{__('Filter by tags')}</Section.Title>

        <Section.QuickButtons>
          <Link to={manageUrl}>
            <Icon icon="settings" />
          </Link>

          {router.getParam(history, 'tag') ? (
            <a href="#cancel" tabIndex={0} onClick={onClick}>
              <Icon icon="cancel-1" />
            </a>
          ) : null}
        </Section.QuickButtons>

        <FilterByParams
          fields={tags}
          paramKey="tag"
          counts={counts}
          icon="tag"
          loading={loading}
        />
      </Box>
    </Section>
  );
}

export default withRouter<IProps>(CountsByTag);
