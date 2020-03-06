import React from 'react';
import { usePreloadedQuery, graphql } from 'react-relay/hooks';
import { Card, Button, Table } from '../ui';
import TransactionList from './TransactionList';
import { Flex, Text } from 'rebass';

function Transaction(props) {
  const data = usePreloadedQuery(
    graphql`
      query TransactionQuery($first: Int!, $after: String) {
        ...TransactionList_query @arguments(first: $first, after: $after)
      }
    `,
    props.prepared.transactionQuery,
  );
  return (
    <>
      <Flex>
        <Text flex={1}>Transactions</Text>
        <Button variant="contained" color="primary">
          Add
        </Button>
      </Flex>
      <Card p="10px">
        <TransactionList query={data} />
      </Card>
    </>
  );
}

export default Transaction;
