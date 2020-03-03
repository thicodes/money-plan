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
        component: JSResource('Dashboard', () => import('./components/dashboard/Dashboard')),
      },
    ],
  },
];

export default routes;
