import Button from 'modules/common/components/Button';
import CollapseContent from 'modules/common/components/CollapseContent';
import { FormControl } from 'modules/common/components/form';
import FormGroup from 'modules/common/components/form/Group';
import ControlLabel from 'modules/common/components/form/Label';
import Info from 'modules/common/components/Info';
import { ModalFooter, Title } from 'modules/common/styles/main';
import { __ } from 'modules/common/utils';
import Wrapper from 'modules/layout/components/Wrapper';
import React from 'react';
import { ContentBox } from '../../styles';
import { KEY_LABELS } from '../constants';
import { IConfigsMap } from '../types';
import Header from './Header';
import Sidebar from './Sidebar';

type Props = {
  save: (configsMap: IConfigsMap) => void;
  configsMap: IConfigsMap;
};

type State = {
  configsMap: IConfigsMap;
};

class ApiTokenConfigs extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      configsMap: props.configsMap
    };
  }

  generate = e => {
    e.preventDefault();

    const { configsMap } = this.state;

    this.props.save(configsMap);
  };

  onChangeConfig = (code: string, value) => {
    const { configsMap } = this.state;

    configsMap[code] = value;

    this.setState({ configsMap });
  };

  onChangeInput = (code: string, e) => {
    this.onChangeConfig(code, e.target.value);
  };

  renderItem(key: string, description?: string) {
    const { configsMap } = this.state;

    return (
      <FormGroup>
        <ControlLabel>{KEY_LABELS[key]}</ControlLabel>
        {description && <p>{__(description)}</p>}
        <FormControl
          defaultValue={configsMap[key]}
          onChange={this.onChangeInput.bind(this, key)}
        />
      </FormGroup>
    );
  }

  renderContent = () => {
    return (
      <ContentBox>
        <CollapseContent title="MAIN">
          <Info>
            <a target="_blank" href="Variables" rel="noopener noreferrer">
              {__('More: Understanding Facebook Integration Variables')}
            </a>
          </Info>
          {this.renderItem('API_KEY')}
          {this.renderItem('API_TOKEN')}

          <ModalFooter>
            <Button
              btnStyle="primary"
              icon="message"
              onClick={this.generate}
              uppercase={false}
            >
              Generate
            </Button>
          </ModalFooter>
        </CollapseContent>
      </ContentBox>
    );
  };

  render() {
    const breadcrumb = [
      { title: __('Settings'), link: '/settings' },
      { title: __('Api Auth Token Configs') }
    ];

    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={__('Api Auth Token Configs')}
            breadcrumb={breadcrumb}
          />
        }
        mainHead={<Header />}
        actionBar={
          <Wrapper.ActionBar
            left={<Title>{__('Api Auth Token Configs')}</Title>}
          />
        }
        leftSidebar={<Sidebar />}
        content={this.renderContent()}
      />
    );
  }
}

export default ApiTokenConfigs;
