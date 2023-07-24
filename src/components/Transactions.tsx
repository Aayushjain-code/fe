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
  Link,
  FormControl,
  Select,
  MenuItem,
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
  const [filterType, setFilterType] = useState<"date" | "amount">("date");
  const [filterValue, setFilterValue] = useState<string | number>("");

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

  // Convert the filterValue to a Date object for date filtering
  const parsedDateFilterValue = useMemo(() => {
    if (filterValue && filterType === "date") {
      const dateValue = new Date(filterValue);
      return isNaN(dateValue.getTime()) ? null : dateValue;
    }
    return null;
  }, [filterValue, filterType]);

  // Filter transactions based on selected filter type and value
  const filteredTransactions = useMemo(() => {
    if (filterType === "date") {
      return parsedDateFilterValue
        ? transactions.filter(
            (transaction) =>
              new Date(transaction.date).toDateString() ===
              parsedDateFilterValue.toDateString()
          )
        : transactions;
    } else if (filterType === "amount") {
      const amountValue = parseFloat(filterValue as string);
      return filterValue
        ? transactions.filter(
            (transaction) => transaction.amount === amountValue
          )
        : transactions;
    } else {
      return transactions;
    }
  }, [transactions, filterType, parsedDateFilterValue, filterValue]);

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "_id",
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
    { columns, data: filteredTransactions },
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

  const handleFilterTypeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setFilterType(event.target.value as "date" | "amount");
    setFilterValue("");
  };

  const handleFilterValueChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setFilterValue(event.target.value as string | number);
  };

  return (
    <Box sx={{ width: "100%", margin: "20px", overflowX: "hidden" }}>
      <Paper
        sx={{
          width: "90%",
          overflow: "hidden",
          margin: "20px",
          padding: "20px",
        }}
      >
        {/* Filter Dropdown */}
        <FormControl
          variant="outlined"
          sx={{ minWidth: 200, marginBottom: "10px" }} // Increased the width
        >
          <Select value={filterType} onChange={handleFilterTypeChange}>
            <MenuItem value="date">Filter by Date</MenuItem>
            <MenuItem value="amount">Filter by Amount</MenuItem>
          </Select>
        </FormControl>
        {filterType === "amount" && (
          <input
            type="number"
            value={filterValue as string}
            onChange={handleFilterValueChange}
            placeholder="Enter amount..."
            style={{ height: "50px", marginLeft: "10px" }} // Adjusted the height and margin
          />
        )}
        {filterType === "date" && (
          <input
            type="date"
            value={filterValue as string}
            onChange={handleFilterValueChange}
            style={{ height: "50px", marginLeft: "10px" }} // Adjusted the height and margin
          />
        )}

        <TableContainer sx={{ maxWidth: "100%", overflowX: "hidden" }}>
          <Table stickyHeader {...getTableProps()}>
            {/* Table Header */}
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
                      sx={{
                        fontWeight: "bold",
                        borderBottom: "1px solid black",
                        padding: "12px",
                      }}
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
            {/* Table Body */}
            <TableBody {...getTableBodyProps()}>
              {tablePage.map((row) => {
                prepareRow(row);
                return (
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <TableCell
                          {...cell.getCellProps()}
                          sx={{
                            padding: "12px",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          {cell.column.id === "date"
                            ? new Date(cell.value).toLocaleDateString()
                            : cell.render("Cell")}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Table Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
          component="div"
          count={filteredTransactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ padding: "20px" }}
        />
        {/* CSV Export */}
        <CSVLink
          data={filteredTransactions}
          filename={"wallet_transactions.csv"}
          style={{ textDecoration: "none" }}
        >
          <Link
            variant="button"
            color="primary"
            underline="none"
            sx={{
              display: "inline-block",
              backgroundColor: "#1976d2",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              marginTop: "10px",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#135ba1",
              },
            }}
          >
            Export CSV
          </Link>
        </CSVLink>
      </Paper>
    </Box>
  );
};

export default Transactions;
