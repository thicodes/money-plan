import { preloadQuery } from 'react-relay/hooks';
import JSResource from './routing/JSResource';

export const routes = [
  {
    component: JSResource('Auth', () => import('./components/auth/AuthRoot')),
    path: '/auth',
    exact: false,
    routes: [
      {
        path: '/auth/signUp',
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
    routes: [
      {
        path: '/',
        exact: true,
        component: JSResource('Teste', () => import('./components/Teste')),
      },
    ],
  },
  // {
  //   component: JSResource('Auth', () => import('./components/auth/AuthRoot')),
  //   path: '/auth',
  //   exact: false,
  //   routes: [
  //     {
  //       path: '/auth/signUp',
  //       exact: true,
  //       component: JSResource('SignUp', () => import('./components/auth/SignUp')),
  //     },
  //     {
  //       path: 'auth/login',
  //       exact: true,
  //       component: JSResource('Login', () => import('./omponents/auth/Login')),
  //     },
  //   ],
  // },
  // {
  //   component: JSResource('Root', () => import('./components/feed/Root')),
  //   path: '/',
  //   exact: false,
  //   prepare: () => {
  //     const RootQuery = require('./components/feed/__generated__/RootQuery.graphql');
  //     return {
  //       rootQuery: preloadQuery(
  //         Environment,
  //         RootQuery,
  //         {},
  //         {
  //           fetchPolicy: 'network-only',
  //         },
  //       ),
  //     };
  //   },
  //   routes: [
  //     {
  //       path: '/',
  //       exact: true,
  //       component: JSResource('Feed', () => import('./component/feed/Feed')),
  //       prepare: () => {
  //         const FeedQuery = require('./components/feed/__generated__/FeedQuery.graphql');

  //         return {
  //           feedQuery: preloadQuery(
  //             Environment,
  //             FeedQuery,
  //             {},
  //             {
  //               fetchPolicy: 'store-or-network',
  //             },
  //           ),
  //         };
  //       },
  //     },
  //     {
  //       path: '/post/:id',
  //       exact: true,
  //       component: JSResource('PostDetail', () => import('./components/feed/post/PostDetail')),
  //       prepare: (params: { id: string }) => {
  //         const PostDetailQuery = require('./components/feed/post/__generated__/PostDetailQuery.graphql');

  //         return {
  //           postDetailQuery: preloadQuery(
  //             Environment,
  //             PostDetailQuery,
  //             {
  //               id: params.id,
  //             },
  //             {
  //               fetchPolicy: 'store-or-network',
  //             },
  //           ),
  //         };
  //       },
  //     },
  //   ],
  // },
];

export default routes;
