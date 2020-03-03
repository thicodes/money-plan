import React from 'react';
import { graphql } from 'react-relay';
import { usePreloadedQuery } from 'react-relay/hooks';
import AppBar from '@material-ui/core/AppBar';

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

  return (
    <>
      <AppBar position="static" color="primary">
        Logout
      </AppBar>
    </>
  );
}
