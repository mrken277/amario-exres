import { __ } from 'modules/common/utils';
import Wrapper from 'modules/layout/components/Wrapper';
import React from 'react';
import Onboarding from '../containers/Onboarding';

class Robot extends React.PureComponent<{ entries: any[] }> {
  render() {
    const content = (
      <>
        <Onboarding />

        <button
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            marginBottom: '10px',
            marginLeft: '10px',
            fontSize: '20px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          RB
        </button>
      </>
    );

    return (
      <Wrapper
        header={<Wrapper.Header title={__('Robot')} />}
        content={content}
        transparent={true}
        center={true}
      />
    );
  }
}

export default Robot;
