import React, { Suspense } from 'react';
import { usePreloadedQuery, graphql } from 'react-relay/hooks';
import { renderRoutes } from 'react-router-config';
import { Card, Button, Table, Spinner } from '../ui';
import TransactionList from './TransactionList';
// import TransactionComposerDialog from './TransactionComposerDialog';
import { Flex, Text } from 'rebass';
import Link from '../../routing/Link';

import { TransactionQuery } from './__generated__/TransactionQuery.graphql';

type Props = {
  prepared: {
    transactionQuery: any;
  };
};

function Transaction(route: Props) {
  console.log('Transaction', route);
  const { prepared, children } = route;

  const data = usePreloadedQuery<TransactionQuery>(
    graphql`
      query TransactionQuery {
        ...TransactionList_query
      }
    `,
    prepared.transactionQuery,
  );

  return (
    <>
      <Flex>
        <Text flex={1}>Transactions</Text>
        <Suspense fallback={<Spinner />}>{children}</Suspense>
        <Link variant="contained" color="primary" as={Button} to="/transactions/add">
          + Add
        </Link>
      </Flex>
      <Card p="10px">
        <TransactionList query={data} />
      </Card>
    </>
  );
}

export default Transaction;
