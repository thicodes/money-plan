import React from 'react';
import { Card, Button, Table } from '../ui';
import { Flex, Text } from 'rebass';
import { usePaginationFragment, graphql } from 'react-relay/hooks';

const range = len => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = () => {
  const statusChance = Math.random();
  return {
    firstName: 'asdasdasd',
    lastName: 'gsfgsdfsdfsdf',
    age: Math.floor(Math.random() * 30),
    visits: Math.floor(Math.random() * 100),
    progress: Math.floor(Math.random() * 100),
    status: statusChance > 0.66 ? 'relationship' : statusChance > 0.33 ? 'complicated' : 'single',
  };
};

function makeData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth];
    return range(len).map(d => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      };
    });
  };
  return makeDataLevel();
}

function TransactionList(props) {
  const columns = React.useMemo(
    () => [
      {
        Header: 'First Name',
        accessor: 'firstName',
      },
      {
        Header: 'Last Name',
        accessor: 'lastName',
      },
      {
        Header: 'Age',
        accessor: 'age',
      },
      {
        Header: 'Visits',
        accessor: 'visits',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Profile Progress',
        accessor: 'progress',
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
            }
          }
        }
      }
    `,
    props.query,
  );
  return (
    <>
      <Table
        columns={columns}
        data={data}
        setData={() => {}}
        updateMyData={updateMyData}
        skipPageReset={skipPageReset}
      />
    </>
  );
}

export default TransactionList;
