import React from 'react';
import { Card, Button, Table } from '../ui';
import { Flex, Text } from 'rebass';
import { usePaginationFragment, graphql } from 'react-relay/hooks';

import { TransactionList_query$key } from './__generated__/TransactionList_query.graphql'
import { TransactionListPaginationQuery  } from './__generated__/TransactionListPaginationQuery.graphql';

import { useTranslation } from "react-i18next";

type Props = {
  query: TransactionList_query$key;
};

function TransactionList(props: Props) {
  const { i18n } = useTranslation();
  const columns = React.useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'date',
        Cell: ({ cell: { value } }) => (value ? Intl.DateTimeFormat(i18n.language).format(new Date(value))  : '')
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Paid/Pending',
        acessor: 'isPaid'
      },
    ],
    [],
  );
  // const [data, setData] = React.useState(React.useMemo(() => makeData(20), []));
  // console.log(data);
  const [skipPageReset, setSkipPageReset] = React.useState(false);
  const { data, loadNext, isLoadingNext } = usePaginationFragment<TransactionListPaginationQuery, _>(
    graphql`
      fragment TransactionList_query on Query
        @argumentDefinitions(first: { type: "Int", defaultValue: 30 }, after:{ type: "String" })
        @refetchable(queryName: "TransactionListPaginationQuery") {
        transactions(first: $first, after: $after) @connection(key: "Transactions_transactions", filters: []) {
          endCursorOffset
          startCursorOffset
          count
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          edges {
            node {
              id
              date
              name
              isPaid
            }
          }
        }
      }
    `,
    props.query,
  );
  const { transactions } = data;
  const { pageInfo } = transactions;
  const transactionsMapEdges = (transactions?.edges ?? []).map(edge => edge.node);
  const loadMore = () => {
    if (isLoadingNext) {
      return;
    }
    loadNext(30);
  };
  return (
    <>
      <Table
        columns={columns}
        data={transactionsMapEdges}
        setData={() => {}}
        skipPageReset={skipPageReset}
        onLoadMore={loadMore}
        pageInfo={pageInfo}
      />
    </>
  );
}

export default TransactionList;
