import React from 'react';
import { usePreloadedQuery, graphql } from 'react-relay/hooks';
import { Card, Button, Table } from '../ui';
import TransactionList from './TransactionList';
import TransactionCreate from './TransactionCreate';
import { Flex, Text } from 'rebass';

import { TransactionQuery } from './__generated__/TransactionQuery.graphql';

type Props = {
  prepared: {
    transactionQuery: any;
  };
};

function Transaction({ prepared }: Props) {
  const [isOpenTransactionCreate, setIsOpenTransactionCreate] = React.useState(false);
  const data = usePreloadedQuery<TransactionQuery>(
    graphql`
      query TransactionQuery {
        ...TransactionList_query
        ...TransactionCreate_query
      }
    `,
    prepared.transactionQuery,
  );
  return (
    <>
      <Flex>
        <Text flex={1}>Transactions</Text>
        <Button variant="contained" color="primary" onClick={() => setIsOpenTransactionCreate(true)}>
          Add
        </Button>
        {isOpenTransactionCreate && (
          <TransactionCreate query={data} onCancel={() => setIsOpenTransactionCreate(false)} />
        )}
      </Flex>
      <Card p="10px">
        <TransactionList query={data} />
      </Card>
    </>
  );
}

export default Transaction;
