import { preloadQuery } from 'react-relay/hooks';
import JSResource from './routing/JSResource';
import { Environment } from './relay';

export const routes = [
  {
    component: JSResource('Auth', () => import('./components/auth/AuthRoot')),
    path: '/auth',
    exact: false,
    routes: [
      {
        path: '/auth/signup',
        exact: true,
        component: JSResource('SignUp', () => import('./components/auth/SignUp')),
      },
      {
        path: '/auth/login',
        exact: true,
        component: JSResource('Login', () => import('./components/auth/Login')),
      },
    ],
  },
  {
    component: JSResource('Root', () => import('./Root')),
    prepare: () => {
      const RootQuery = require('./__generated__/RootQuery.graphql');
      return {
        rootQuery: preloadQuery(
          Environment,
          RootQuery,
          {},
          {
            fetchPolicy: 'network-only',
          },
        ),
      };
    },
    routes: [
      {
        path: '/',
        exact: true,
        component: JSResource('Dashboard', () => import('./components/dashboard/Dashboard')),
      },
      {
        path: '/transactions',
        exact: true,
        component: JSResource('Transactions', () => import('./components/transaction/Transaction')),
        prepare: () => {
          const TransactionQuery = require('./components/transaction/__generated__/TransactionQuery.graphql');

          return {
            transactionQuery: preloadQuery(
              Environment,
              TransactionQuery,
              {},
              {
                fetchPolicy: 'network-only',
              },
            ),
          };
        },
      },
    ],
  },
];

export default routes;
