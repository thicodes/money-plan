import React, { Suspense } from 'react';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { hot } from 'react-hot-loader';
import { createBrowserHistory } from 'history';

import { SnackbarProvider } from 'notistack';
import RelayEnvironment from './relay/Environment';
import RouterRenderer from './routing/RouteRenderer';
import ErrorBoundary from './ErrorBoundary';
import routes from './routes';
import RoutingContext from './routing/RoutingContext';
import createRouter from './routing/createRouter';

const router = createRouter(routes, createBrowserHistory());

function App() {
  return (
    <RoutingContext.Provider value={router.context}>
      <RelayEnvironmentProvider environment={RelayEnvironment}>
        <SnackbarProvider>
          <RouterRenderer />
        </SnackbarProvider>
      </RelayEnvironmentProvider>
    </RoutingContext.Provider>
  );
}

export default hot(module)(App);
