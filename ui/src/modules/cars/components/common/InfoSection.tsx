import Icon from 'modules/common/components/Icon';
import ModalTrigger from 'modules/common/components/ModalTrigger';
import { InfoWrapper, Links } from 'modules/common/styles/main';
import { Name, NameContainer } from 'modules/customers/styles';
import React from 'react';
import CarForm from '../../containers/CarForm';
import { ICar } from '../../types';

type Props = {
  car: ICar;
  children?: React.ReactNode;
};

class InfoSection extends React.Component<Props> {
  renderLink(value, icon) {
    let link = value;

    if (!value) {
      return null;
    }

    if (!value.includes('http')) {
      link = 'http://'.concat(value);
    }

    return (
      <a href={link} target="_blank" rel="noopener noreferrer">
        <Icon icon={icon} />
      </a>
    );
  }

  renderLinks(links) {
    return (
      <Links>
        {this.renderLink(links.facebook, 'facebook')}
        {this.renderLink(links.linkedIn, 'linkedin')}
        {this.renderLink(links.twitter, 'twitter')}
        {this.renderLink(links.youtube, 'youtube-play')}
        {this.renderLink(links.github, 'github-circled')}
        {this.renderLink(links.website, 'external-link-alt')}
      </Links>
    );
  }

  render() {
    const { car, children } = this.props;
    const { links = {} } = car;

    const content = props => <CarForm {...props} car={car} />;

    return (
      <InfoWrapper>
        <NameContainer>
          <Name fontSize={16}>
            {car.primaryName}

            <ModalTrigger
              title="Edit basic info"
              trigger={<Icon icon="pen-1" />}
              size="lg"
              content={content}
            />
          </Name>
          {this.renderLinks(links)}
        </NameContainer>
        {children}
      </InfoWrapper>
    );
  }
}

export default InfoSection;
