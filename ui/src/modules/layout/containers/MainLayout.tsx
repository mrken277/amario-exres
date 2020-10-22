import { AppConsumer, AppProvider } from 'appContext';
import { IUser } from 'modules/auth/types';
import React from 'react';
import MainLayout from '../components/MainLayout';

import Plugin from '../../../../../plugins/my-plugin/ui/containers/index';


type Props = {
  currentUser?: IUser;
  children: React.ReactNode;
};

const container = (props: Props) => (
  <AppProvider currentUser={props.currentUser}>
    <AppConsumer>
      {({ isShownIndicator, closeLoadingBar }) => (
        <>
          <MainLayout
            {...props}
            isShownIndicator={isShownIndicator}
            closeLoadingBar={closeLoadingBar}
          />

          <Plugin />
        </>
      )}
    </AppConsumer>
  </AppProvider>
);
export default container;
