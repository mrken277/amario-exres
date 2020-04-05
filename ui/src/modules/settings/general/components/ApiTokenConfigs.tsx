import Button from 'modules/common/components/Button';
import CollapseContent from 'modules/common/components/CollapseContent';
import { FormControl } from 'modules/common/components/form';
import FormGroup from 'modules/common/components/form/Group';
import ControlLabel from 'modules/common/components/form/Label';
import Info from 'modules/common/components/Info';
import { ModalFooter, Title } from 'modules/common/styles/main';
import { __, Alert } from 'modules/common/utils';
import Wrapper from 'modules/layout/components/Wrapper';
import React from 'react';
import { ContentBox } from '../../styles';
import { API_TOKEN_SYSTEMS } from '../constants';
import Header from './Header';
import Sidebar from './Sidebar';

type Props = {
  generate: (token: string) => void;
  apiKey: string;
  apiTokens: any;
};

type State = {
  key: string;
  hasAdd: boolean;
};

class ApiTokenConfigs extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const keys = Object.keys(this.props.apiTokens || {});

    this.state = {
      key: '',
      hasAdd: keys.length === 0 ? true : false
    };
  }

  generate = () => {
    const { key } = this.state;

    if (!key) {
      Alert.warning('required key');
      return;
    }

    this.props.generate(key);
    this.setState({ hasAdd: false });
  };

  setStateHasAdd = (value: boolean) => {
    this.setState({ hasAdd: value });
  };

  onChangeAddToken = e => {
    this.setState({ key: (e.currentTarget as HTMLInputElement).value });
  };

  onAddButton = () => {
    this.setState({ hasAdd: true });
  };

  renderAddToken = () => {
    if (!this.state.hasAdd) {
      return <></>;
    }

    return (
      <CollapseContent title={`new token`} open={true}>
        <Info>{`new bla`}</Info>
        <FormGroup>
          <ControlLabel>{`choose system`}</ControlLabel>
          <FormControl
            componentClass="select"
            value={this.state.key}
            options={[{ value: '', label: '' }].concat(
              Object.values(API_TOKEN_SYSTEMS)
            )}
            onChange={this.onChangeAddToken}
          />
        </FormGroup>
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
    );
  };

  renderPerToken = (key, value) => {
    const info = API_TOKEN_SYSTEMS[key];
    return (
      <CollapseContent title={info.label} key={key}>
        <Info>{info.description}</Info>
        <FormGroup>
          <ControlLabel>{`TOKEN`}</ControlLabel>
          <FormControl defaultValue={value} />
        </FormGroup>
      </CollapseContent>
    );
  };

  renderTokens = () => {
    const { apiTokens } = this.props;

    const keys = Object.keys(apiTokens || {});

    return keys.map(key => this.renderPerToken(key, apiTokens[key]));
  };

  renderContent = () => {
    const { apiKey } = this.props;

    return (
      <ContentBox>
        <FormGroup>
          <ControlLabel>API KEY</ControlLabel>
          <FormControl defaultValue={apiKey} disabled={true} />
        </FormGroup>

        {this.renderTokens()}
        {this.renderAddToken()}
      </ContentBox>
    );
  };

  render() {
    const breadcrumb = [
      { title: __('Settings'), link: '/settings' },
      { title: __('Api Auth Token Configs') }
    ];

    const actionButtons = (
      <Button
        btnStyle="primary"
        onClick={this.onAddButton}
        icon="check-circle"
        uppercase={false}
      >
        Add Token
      </Button>
    );

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
            right={actionButtons}
          />
        }
        leftSidebar={<Sidebar />}
        content={this.renderContent()}
      />
    );
  }
}

export default ApiTokenConfigs;
