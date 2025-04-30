import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getPaginationRowModel
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  TableSortLabel
} from '@mui/material';
import { useDrag, useDrop } from 'react-dnd';
//Перетаскиваемые заголовки
const DraggableColumnHeader = ({ header, table }) => {
  const { column } = header;
  // Настройка перетаскивания (drag and drop)
  const [, drag] = useDrag({
    type: 'COLUMN',
    item: () => ({
      id: column.id,
    }),
  });
// Настройка области для сброса
  const [{ isOver }, drop] = useDrop({
    accept: 'COLUMN',
    drop: (draggedItem) => {
      // Логика изменения порядка колонок
      if (draggedItem.id !== column.id) {
        table.setColumnOrder((old) => {
          const draggedIndex = old.indexOf(draggedItem.id);
          const targetIndex = old.indexOf(column.id);
          const newOrder = [...old];
          // Перемещаем колонку
          newOrder.splice(draggedIndex, 1);
          newOrder.splice(targetIndex, 0, draggedItem.id);
          return newOrder;
        });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <TableCell
      ref={(node) => drag(drop(node))}// Делаем ячейку перетаскиваемой
      colSpan={header.colSpan}
      style={{
        opacity: isOver ? 0.5 : 1,
        cursor: 'move',
        userSelect: 'none',
        backgroundColor: isOver ? '#f5f5f5' : 'inherit',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {flexRender(column.columnDef.header, header.getContext())}
        {/* Заголовок с возможностью сортировки */}
        {column.getCanSort() && (
          <TableSortLabel
            active={column.getIsSorted()}
            direction={column.getIsSorted() || 'asc'}
            onClick={column.getToggleSortingHandler()}
          />
        )}
      </Box>
    </TableCell>
  );
};

export default function UserTable({
  columns,
  data,
  onDelete,
  onBlock,
  onEdit
}) {
  const [columnOrder, setColumnOrder] = useState(columns.map(c => c.accessorKey));

  const table = useReactTable({
    data,
    columns,
    state: {
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,// Обработчик изменения порядка
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // Сортировка
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        maxWidth: '100%', 
        overflowX: 'auto',
        '& .sticky-column': {
          position: 'sticky',
          left: 0,
          zIndex: 1,
          backgroundColor: 'background.paper',
        }
      }}
    >
      <Table>
        {/* Заголовки таблицы */}
        <TableHead>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <DraggableColumnHeader 
                  key={header.id} 
                  header={header}
                  table={table}
                />
              ))}
              <TableCell>Действия</TableCell>
            </TableRow>
          ))}
        </TableHead>
        {/* Тело таблицы */}
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell, index) => (
                <TableCell 
                  key={cell.id} 
                  className={index === 0 ? 'sticky-column' : ''}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
              <TableCell className="sticky-column">
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onEdit(row.original)}
                  >
                    Редактировать
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color={row.original.status === 'active' ? 'warning' : 'success'}
                    onClick={() => onBlock(row.original.id)}
                  >
                    {row.original.status === 'active' ? 'Заблокировать' : 'Разблокировать'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => onDelete(row.original.id)}
                  >
                    Удалить
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}