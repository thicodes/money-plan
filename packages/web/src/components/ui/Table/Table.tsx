import React from 'react';

import MaUTable from '@material-ui/core/Table';
import PropTypes from 'prop-types';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActions from './TablePaginationActions';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import InfiniteScroll from 'react-infinite-scroller';
import { Flex } from 'rebass';
import { usePagination, useRowSelect, useSortBy, useTable } from 'react-table';

const Table = ({ columns, data, setData, skipPageReset, onLoadMore, pageInfo }) => {
  const {
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize, selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      autoResetPage: !skipPageReset,
    },
    useSortBy,
    usePagination,
    useRowSelect,
    hooks => {
      hooks.allColumns.push(columns => [
        // Let's make a column for selection
        {
          id: 'selection',
        },
        ...columns,
      ]);
    },
  );

  const handleChangePage = (event, newPage) => {
    gotoPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setPageSize(Number(event.target.value));
  };

  const removeByIndexs = (array, indexs) => array.filter((_, i) => !indexs.includes(i));

  const deleteUserHandler = event => {
    const newData = removeByIndexs(data, Object.keys(selectedRowIds).map(x => parseInt(x, 10)));
    setData(newData);
  };

  const addUserHandler = user => {
    const newData = data.concat([user]);
    setData(newData);
  };

  const infiniteScrollerLoader = (
    <Flex flex={1} alignItem="center" justifyContent="center">
      <CircularProgress />
    </Flex>
  );

  // Render the UI for your table
  return (
    <TableContainer>
      <InfiniteScroll
        pageStart={0}
        loadMore={onLoadMore}
        hasMore={pageInfo.hasNextPage}
        loader={infiniteScrollerLoader}
        useWindow
      >
        <MaUTable {...getTableProps()}>
          <TableHead>
            {headerGroups.map(headerGroup => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <TableCell
                    {...(column.id === 'selection'
                      ? column.getHeaderProps()
                      : column.getHeaderProps(column.getSortByToggleProps()))}
                  >
                    {column.render('Header')}
                    {column.id !== 'selection' ? (
                      <TableSortLabel
                        active={column.isSorted}
                        // react-table has a unsorted state which is not treated here
                        direction={column.isSortedDesc ? 'desc' : 'asc'}
                      />
                    ) : null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>;
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </MaUTable>
      </InfiniteScroll>
    </TableContainer>
  );
};

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  setData: PropTypes.func.isRequired,
  skipPageReset: PropTypes.bool.isRequired,
};

export default Table;
