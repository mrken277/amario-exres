import { IItem } from 'modules/boards/types';
import Icon from 'modules/common/components/Icon';
import Tip from 'modules/common/components/Tip';
import { __, renderFullName, urlParser } from 'modules/common/utils';
import PortableDeal from 'modules/deals/components/PortableDeal';
import Sidebar from 'modules/layout/components/Sidebar';
import { SectionBody, SectionBodyItem } from 'modules/layout/styles';
import PortableTicket from 'modules/tickets/components/PortableTicket';
import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  item: IItem;
};

export default class TaskSidebar extends React.Component<Props, {}> {
  renderContactItem() {
    const { contentType, content } = this.props.item;

    const mailTo = email => {
      if (!email) {
        return null;
      }

      return (
        <a target="_parent" href={`mailto:${email}`} rel="noopener noreferrer">
          {email}
        </a>
      );
    };

    if (contentType === 'company') {
      return (
        <>
          <span>{content.primaryName || 'Unknown'}</span>
          <Tip text={content.website || ''}>
            <a href={`//${content.website}`}>
              {urlParser.extractRootDomain(content.website || '')}
            </a>
          </Tip>
        </>
      );
    }

    return (
      <>
        <span>{renderFullName(content)}</span>
        {mailTo(content.primaryEmail)}
        <span>{content.primaryPhone}</span>
      </>
    );
  }

  renderContent() {
    const { item } = this.props;
    const { contentType, content } = item;

    if (contentType === 'customer' || contentType === 'company') {
      const type = contentType === 'customer' ? 'customers' : 'companies';

      return (
        <SectionBody>
          <SectionBodyItem>
            <Link to={`/contacts/${type}/details/${content._id}`}>
              <Icon icon="logout-2" />
            </Link>
            {this.renderContactItem()}
          </SectionBodyItem>
        </SectionBody>
      );
    }

    if (contentType === 'deal') {
      return <PortableDeal item={content} />;
    }

    return <PortableTicket item={content} />;
  }

  render() {
    const { item } = this.props;
    const { contentType } = item;
    const { Section } = Sidebar;
    const { Title } = Section;

    if (!contentType) {
      return null;
    }

    return (
      <Section>
        <Title>{__(contentType)}</Title>

        {this.renderContent()}
      </Section>
    );
  }
}
