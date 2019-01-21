import { init as initApm } from 'elastic-apm-js-base';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import { render } from 'react-dom';
import apolloClient from './apolloClient';
import Routes from './routes';

import 'erxes-icon/css/erxes.min.css';

// global style
import 'modules/common/styles/global-styles.ts';
import 'react-datetime/css/react-datetime.css';
import 'react-toggle/style.css';

const { REACT_APP_API_URL, NODE_ENV } = process.env;

if (NODE_ENV === 'production') {
  (window as any).apm = initApm({
    serviceName: 'erxes-office-app',
    serverUrl: 'https://apm.erxes.io',
    distributedTracingOrigins: [REACT_APP_API_URL]
  });
}

const target = document.querySelector('#root');

render(
  <ApolloProvider client={apolloClient}>
    <Routes />
  </ApolloProvider>,
  target
);
