import * as React from "react";
import type {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
} from "@/types/table";
import {
  flexRender,
  type ColumnDef,
  type Table as TanstackTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTableFloatingBar } from "./data-table-floating-bar";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  dataTable: TanstackTable<TData>;
  columns: ColumnDef<TData, TValue>[];
  searchableColumns?: DataTableSearchableColumn<TData>[];
  filterableColumns?: DataTableFilterableColumn<TData>[];
  advancedFilter?: boolean;
  floatingBarContent?: React.ReactNode | null;
  columnLabels?: Record<string, string>;
  newRowLink?: string;
  deleteRowsAction?: React.MouseEventHandler<HTMLButtonElement>;
}

export function DataTable<TData, TValue>({
  dataTable,
  columns,
  searchableColumns = [],
  filterableColumns = [],
  advancedFilter = false,
  columnLabels,
  newRowLink,
  floatingBarContent,
  deleteRowsAction,
}: DataTableProps<TData, TValue>) {
  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={dataTable}
        filterableColumns={filterableColumns}
        searchableColumns={searchableColumns}
        deleteRowsAction={deleteRowsAction}
        columnLabels={columnLabels}
        newRowLink={newRowLink}
      />
      <div className="rounded-lg border border-green-100 dark:border-green-900 shadow-sm overflow-hidden">
        <div className="overflow-auto">
          <Table className="w-full border-collapse">
            <TableHeader className="bg-green-50 dark:bg-green-950 sticky top-0 z-10">
              {dataTable.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-green-200 dark:border-green-800"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="h-10 px-4 text-left align-middle font-medium text-green-700 dark:text-green-300 text-[13px] tracking-wide"
                      style={{
                        width: header.column.id === "select" ? "40px" : 
                              header.column.id === "order_code" ? "180px" : 
                              header.column.id === "order_status" ? "150px" : 
                              header.column.id === "order_date" ? "120px" : 
                              header.column.id === "customer_id" ? "160px" : 
                              header.column.id === "order_total" ? "120px" : 
                              header.column.id === "payment_type" ? "150px" : 
                              header.column.id === "shipping_address" ? "200px" : 
                              header.column.id === "actions" ? "100px" : "auto"
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {dataTable.getRowModel().rows?.length ? (
                dataTable.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`
                      border-b border-green-100 dark:border-green-900
                      ${index % 2 === 0 ? 'bg-white dark:bg-gray-950' : 'bg-green-50/40 dark:bg-green-950/40'}
                      hover:bg-green-100/50 dark:hover:bg-green-900/30
                      ${row.getIsSelected() ? 'bg-green-100 dark:bg-green-900/50 hover:bg-green-100 dark:hover:bg-green-900/50' : ''}
                    `}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="p-3 text-sm align-middle"
                        style={{
                          width: cell.column.id === "select" ? "40px" : 
                                cell.column.id === "order_code" ? "180px" : 
                                cell.column.id === "order_status" ? "150px" : 
                                cell.column.id === "order_date" ? "120px" : 
                                cell.column.id === "customer_id" ? "160px" : 
                                cell.column.id === "order_total" ? "120px" : 
                                cell.column.id === "payment_type" ? "150px" : 
                                cell.column.id === "shipping_address" ? "200px" : 
                                cell.column.id === "actions" ? "100px" : "auto"
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-gray-500 dark:text-gray-400 italic"
                  >
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={dataTable} />
        {dataTable.getFilteredSelectedRowModel().rows.length > 0 &&
          floatingBarContent}
      </div>
    </div>
  );
}
