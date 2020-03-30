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
  children: React.ReactNode;
};

function Transaction(props: Props) {
  const { prepared, children } = props;

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
        <Text fontSize={4} flex={1}>
          Transactions
        </Text>
        {children}
        <Link variant="contained" color="primary" as={Button} to="/transactions/add" color="primary">
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
