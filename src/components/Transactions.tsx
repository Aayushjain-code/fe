// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useTable, usePagination, useSortBy } from "react-table";
import { CSVLink } from "react-csv";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
} from "@mui/material";

interface Transaction {
  id: string;
  amount: number;
  balance: number;
  description: string;
  date: string;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const walletId = localStorage.getItem("walletId");
    if (walletId) {
      axios
        .get<Transaction[]>(
          `http://localhost:3000/transactions?walletId=${walletId}`
        )
        .then((res) => {
          console.log(res);
          setTransactions(res.data);
        });
    }
  }, []);
  // console.log(transactions);
  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Amount",
        accessor: "amount",
      },
      {
        Header: "Balance",
        accessor: "balance",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Date",
        accessor: "date",
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page: tablePage,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
  } = useTable<Transaction>(
    { columns, data: transactions },
    useSortBy,
    usePagination
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    nextPage();
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader {...getTableProps()}>
            <TableHead>
              {headerGroups.map((headerGroup) => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <TableCell
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      sortDirection={
                        column.isSorted
                          ? column.isSortedDesc
                            ? "desc"
                            : "asc"
                          : false
                      }
                    >
                      {column.render("Header")}
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()}>
              {tablePage.map((row) => {
                prepareRow(row);
                return (
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <TableCell {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
          component="div"
          count={transactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <CSVLink data={transactions} filename={"wallet_transactions.csv"}>
          Export CSV
        </CSVLink>
      </Paper>
    </Box>
  );
};

export default Transactions;
