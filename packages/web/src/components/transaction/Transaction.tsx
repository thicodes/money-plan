import React from 'react';
import { usePreloadedQuery, graphql } from 'react-relay/hooks';
import { Card, Button, Table } from '../ui';
import TransactionList from './TransactionList';
import TransactionCreate from './TransactionCreate';
import { Flex, Text } from 'rebass';

function Transaction(props) {
  const [isOpenTransactionCreate, setIsOpenTransactionCreate] = React.useState(false);
  const data = usePreloadedQuery(
    graphql`
      query TransactionQuery($first: Int, $after: String) {
        ...TransactionList_query @arguments(first: $first, after: $after)
      }
    `,
    props.prepared.transactionQuery,
  );
  return (
    <>
      <Flex>
        <Text flex={1}>Transactions</Text>
        <Button variant="contained" color="primary" onClick={() => setIsOpenTransactionCreate(true)}>
          Add
        </Button>
        {isOpenTransactionCreate && <TransactionCreate onCancel={() => setIsOpenTransactionCreate(false)} />}
      </Flex>
      <Card p="10px">
        <TransactionList query={data} />
      </Card>
    </>
  );
}

export default Transaction;
