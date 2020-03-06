import React from 'react';
import { Card, Button, Table } from '../ui';
import { Flex, Text } from 'rebass';
import { usePaginationFragment, graphql } from 'react-relay/hooks';

function TransactionList(props) {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
    ],
    [],
  );
  // const [data, setData] = React.useState(React.useMemo(() => makeData(20), []));
  // console.log(data);
  const [skipPageReset, setSkipPageReset] = React.useState(false);
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      }),
    );
  };
  const { data, loadNext, isLoadingNext } = usePaginationFragment(
    graphql`
      fragment TransactionList_query on Query
        @argumentDefinitions(first: { type: Int, defaultValue: 3 }, after: { type: String })
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
              name
            }
          }
        }
      }
    `,
    props.query,
  );
  const transactions = (data.transactions?.edges ?? []).map(edge => edge.node);
  return (
    <>
      <Table
        columns={columns}
        data={transactions}
        setData={() => {}}
        updateMyData={updateMyData}
        skipPageReset={skipPageReset}
      />
    </>
  );
}

export default TransactionList;
