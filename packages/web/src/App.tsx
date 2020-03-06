import React, { Suspense } from 'react';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { hot } from 'react-hot-loader';
import { createBrowserHistory } from 'history';
import { StylesProvider } from '@material-ui/styles';
import { ThemeProvider } from 'styled-components';

import { SnackbarProvider } from 'notistack';
import RelayEnvironment from './relay/Environment';
import RouterRenderer from './routing/RouteRenderer';
import ErrorBoundary from './ErrorBoundary';
import routes from './routes';
import RoutingContext from './routing/RoutingContext';
import createRouter from './routing/createRouter';

import theme from './theme';

const router = createRouter(routes, createBrowserHistory());

function App() {
  return (
    <RoutingContext.Provider value={router.context}>
      <RelayEnvironmentProvider environment={RelayEnvironment}>
        <ThemeProvider theme={theme}>
          <StylesProvider>
            <SnackbarProvider>
              <RouterRenderer />
            </SnackbarProvider>
          </StylesProvider>
        </ThemeProvider>
      </RelayEnvironmentProvider>
    </RoutingContext.Provider>
  );
}

export default hot(module)(App);
