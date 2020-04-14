import '@nateradebaugh/react-datetime/css/react-datetime.css';
import * as Sentry from '@sentry/browser';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import { init as initApm } from 'elastic-apm-js-base';
import 'erxes-icon/css/erxes.min.css';
// global style
import 'modules/common/styles/global-styles.ts';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { render } from 'react-dom';
import apolloClient, { getEnv } from './apolloClient';
import Routes from './routes';

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

const { REACT_APP_API_URL, NODE_ENV, REACT_APP_SENTRY_DSN } = getEnv();

if (NODE_ENV === 'production') {
  (window as any).apm = initApm({
    serviceName: 'erxes-office-app',
    serverUrl: 'https://apm.erxes.io',
    distributedTracingOrigins: [REACT_APP_API_URL]
  });
}

if (REACT_APP_SENTRY_DSN) {
  Sentry.init({
    dsn: REACT_APP_SENTRY_DSN
  });
}

const target = document.querySelector('#root');

const envs = getEnv();

fetch(
  `${envs.REACT_APP_API_URL}/set-frontend-cookies?envs=${JSON.stringify(envs)}`,
  { credentials: 'include' }
)
  .then(response => response.text())
  .then(() => {
    render(
      <ApolloProvider client={apolloClient}>
        <Routes />
      </ApolloProvider>,
      target
    );
  });
