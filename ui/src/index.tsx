import cubejs from '@cubejs-client/core';
import { CubeProvider } from '@cubejs-client/react';
import '@nateradebaugh/react-datetime/css/react-datetime.css';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'erxes-icon/css/erxes.min.css';
// global style
import 'modules/common/styles/global-styles.ts';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { render } from 'react-dom';
import apolloClient from './apolloClient';
import Routes from './routes';

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

const CUBEJS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1ODQ2MzI5ODcsImV4cCI6MTU4NDcxOTM4N30.HYBOZrBDOu-cx2xy_6bEqtY50ayjia7jP5NS2tyYP7c';

const API_URL = 'http://localhost:4000';

const cubejsApi = cubejs(CUBEJS_TOKEN, {
  apiUrl: `${API_URL}/cubejs-api/v1`
});

const target = document.querySelector('#root');

render(
  <CubeProvider cubejsApi={cubejsApi}>
    <ApolloProvider client={apolloClient}>
      <Routes />
    </ApolloProvider>
  </CubeProvider>,
  target
);
