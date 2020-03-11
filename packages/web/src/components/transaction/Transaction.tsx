import React from 'react';
import { usePreloadedQuery, graphql } from 'react-relay/hooks';
import { Card, Button, Table } from '../ui';
import TransactionList from './TransactionList';
import TransactionComposerDialog from './TransactionComposerDialog';
import { Flex, Text } from 'rebass';

import { TransactionQuery } from './__generated__/TransactionQuery.graphql';

type Props = {
  prepared: {
    transactionQuery: any;
  };
};

function Transaction({ prepared }: Props) {
  const [isOpenTransactionComposer, setIsOpenTransactionComposer] = React.useState(false);
  const data = usePreloadedQuery<TransactionQuery>(
    graphql`
      query TransactionQuery {
        ...TransactionList_query
        ...TransactionComposerDialog_query
      }
    `,
    prepared.transactionQuery,
  );
  return (
    <>
      <Flex>
        <Text flex={1}>Transactions</Text>
        <Button variant="contained" color="primary" onClick={() => setIsOpenTransactionComposer(true)}>
          Add
        </Button>
        {isOpenTransactionComposer && (
          <TransactionComposerDialog query={data} onCancel={() => setIsOpenTransactionComposer(false)} />
        )}
      </Flex>
      <Card p="10px">
        <TransactionList query={data} />
      </Card>
    </>
  );
}

export default Transaction;
