import Button from 'modules/common/components/Button';
import {
  ControlLabel,
  FormControl,
  FormGroup
} from 'modules/common/components/form';
import { Alert } from 'modules/common/utils';
import Wrapper from 'modules/layout/components/Wrapper';
import React, { useState } from 'react';

const Home = () => {
  const [token, setToken] = useState('');

  const onSubmit = e => {
    e.preventDefault();

    const url = `http://localhost:3500/activate-installation`;
    const options = {
      method: 'post',
      body: JSON.stringify({
        token
      }),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      cors: 'no-cors'
    };

    fetch(url, options)
      .then(resp => resp.json())
      .then(res => {
        Alert.success(res);
      })
      .catch((error: any) => {
        Alert.error(error);
      });
  };

  const onChange = e => {
    setToken(e.target.value);
  };

  const content = (
    <form onSubmit={onSubmit}>
      <FormGroup>
        <ControlLabel required={true}>Token</ControlLabel>

        <FormControl
          onChange={onChange}
          value={token}
          name="token"
          required={true}
          autoFocus={true}
        />

        <Button type="submit">Activate</Button>
      </FormGroup>
    </form>
  );

  return (
    <Wrapper
      header={<Wrapper.Header title="Activate installation" />}
      center={true}
      content={content}
    />
  );
};

export default Home;
