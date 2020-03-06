import React from 'react';
import { graphql } from 'react-relay';
import { usePreloadedQuery } from 'react-relay/hooks';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useAuth } from './components/auth/useAuth';
import NavBar from './components/navbar/NavBar';
import { Content } from './components/ui';

type Props = {
  children: React.ReactNode;
  prepared: {
    rootQuery: any;
  };
};

export default function Root({ children, prepared }: Props) {
  const data = usePreloadedQuery(
    graphql`
      query RootQuery {
        me {
          ...useAuth_user
        }
      }
    `,
    prepared.rootQuery,
  );

  const isAuthenticated = useAuth(data.me);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <CssBaseline />
      <NavBar />
      <Content pt={'32px'} pb={'32px'}>
        {children}
      </Content>
    </>
  );
}
