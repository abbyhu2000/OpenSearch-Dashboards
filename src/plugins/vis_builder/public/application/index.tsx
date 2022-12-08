/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { Store } from 'redux';
import { AppMountParameters } from '../../../../core/public';
import { VisBuilderServices } from '../types';
import { VisBuilderApp } from './app';
import { OpenSearchDashboardsContextProvider } from '../../../opensearch_dashboards_react/public';
import { EDIT_PATH } from '../../common';
import { PersistGate } from 'redux-persist/integration/react'
import { Persistor } from 'redux-persist'

export const renderApp = (
  { element, history }: AppMountParameters,
  services: VisBuilderServices,
  store: Store,
  persistor: Persistor
) => {
  ReactDOM.render(
    <Router history={history}>
      <OpenSearchDashboardsContextProvider services={services}>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
          <services.i18n.Context>
            <Switch>
              <Route path={[`${EDIT_PATH}/:id`, '/']} exact={false}>
                <VisBuilderApp />
              </Route>
            </Switch>
          </services.i18n.Context>
          </PersistGate>
        </ReduxProvider>
      </OpenSearchDashboardsContextProvider>
    </Router>,
    element
  );

  return () => ReactDOM.unmountComponentAtNode(element);
};
