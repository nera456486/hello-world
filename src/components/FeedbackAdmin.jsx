import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  TableSortLabel,
  Box
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { 
  useReactTable, 
  getCoreRowModel, 
  getSortedRowModel,
  flexRender 
} from '@tanstack/react-table';

const FeedbackAdmin = ({ feedback, onDelete }) => {
  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 70,
      },
      {
        accessorKey: 'userName',
        header: 'Пользователь',
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'userId',
        header: 'Email',
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'text',
        header: 'Сообщение',
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'date',
        header: 'Дата',
        cell: info => new Date(info.getValue()).toLocaleString(),
        sortingFn: (rowA, rowB, columnId) => {
          return new Date(rowA.getValue(columnId)) - new Date(rowB.getValue(columnId));
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: feedback,
    columns,
    getCoreRowModel: getCoreRowModel(),// Базовые функции
    getSortedRowModel: getSortedRowModel(),// Поддержка сортировки
  });

  if (!feedback || feedback.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        Нет данных обратной связи
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
      <Table stickyHeader aria-label="feedback table">
        <TableHead>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableCell key={header.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getCanSort() && (
                      <TableSortLabel
                        active={header.column.getIsSorted()}
                        direction={header.column.getIsSorted() || 'asc'}
                        onClick={header.column.getToggleSortingHandler()}
                      />
                    )}
                  </Box>
                </TableCell>
              ))}
              <TableCell>Действия</TableCell>
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
              <TableCell>
                <IconButton
                  onClick={() => onDelete(row.original.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FeedbackAdmin;