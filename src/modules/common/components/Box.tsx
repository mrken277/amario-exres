import Icon from 'modules/common/components/Icon';
import {
  SectionContainerStyled,
  SidebarCollapse
} from 'modules/inbox/components/conversationDetail/sidebar/styles';
import Sidebar from 'modules/layout/components/Sidebar';
import React from 'react';

type BoxProps = {
  title: string;
  name: string;
  children: React.ReactNode;
  isOpen: boolean;
  toggle: (params: { name: string; isOpen: boolean }) => void;
};

type BoxState = {
  isOpen: boolean;
};

// const STORAGE_KEY = `erxes_sidebar_section_config`;

// const toggleSection = ({ name, isOpen }: { name: string; isOpen: boolean }) => {
//   // const customerId = this.props.conversation.customerId;
//   const config = getConfig(STORAGE_KEY);

//   config[name] = isOpen;

//   setConfig(STORAGE_KEY, config);

//   // this.getCustomerDetail(customerId);
// };

class Box extends React.Component<BoxProps, BoxState> {
  constructor(props: BoxProps) {
    super(props);

    this.state = {
      isOpen: props.isOpen
    };
  }

  toggle = () => {
    const { name, toggle } = this.props;
    const { isOpen } = this.state;

    this.setState({ isOpen: !isOpen });

    toggle({ name, isOpen: !isOpen });
  };

  renderDropBtn() {
    const icon = this.state.isOpen ? 'downarrow' : 'rightarrow-2';

    return (
      <SidebarCollapse onClick={this.toggle}>
        <Icon icon={icon} />
      </SidebarCollapse>
    );
  }

  render() {
    const { Section } = Sidebar;
    const { Title } = Section;

    const { isOpen } = this.state;
    const { children, title } = this.props;

    if (!isOpen) {
      return (
        <SectionContainerStyled>
          <Title>{title}</Title>
          {this.renderDropBtn()}
        </SectionContainerStyled>
      );
    }

    return (
      <SectionContainerStyled>
        {children}
        {this.renderDropBtn()}
      </SectionContainerStyled>
    );
  }
}

export default Box;
