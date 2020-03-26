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
            fetchPolicy: 'store-or-network',
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
        component: JSResource('Transactions', () => import('./components/transaction/Transaction')),
        prepare: () => {
          const TransactionQuery = require('./components/transaction/__generated__/TransactionQuery.graphql');

          return {
            transactionQuery: preloadQuery(
              Environment,
              TransactionQuery,
              {},
              {
                fetchPolicy: 'store-or-network',
              },
            ),
          };
        },
        routes: [
          {
            path: '/transactions/add',
            exact: false,
            component: JSResource('TransactionsAdd', () =>
              import('./components/transaction/TransactionComposerDialog'),
            ),
            prepare: () => {
              const TransactionComposerDialogQuery = require('./components/transaction/__generated__/TransactionComposerDialogQuery.graphql');

              return {
                transactionComposerDialogQuery: preloadQuery(
                  Environment,
                  TransactionComposerDialogQuery,
                  {},
                  {
                    fetchPolicy: 'store-or-network',
                  },
                ),
              };
            },
          },
        ],
      },
    ],
  },
];

export default routes;
