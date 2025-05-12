"use client"

import * as React from "react"
import Link from "next/link"
import type {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
} from "@/types/table"
import { Cross2Icon, PlusCircledIcon, TrashIcon } from "@radix-ui/react-icons"
import { Search, Filter } from "lucide-react"
import type { Table } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterableColumns?: DataTableFilterableColumn<TData>[]
  searchableColumns?: DataTableSearchableColumn<TData>[]
  newRowLink?: string
  columnLabels?: Record<string, string>
  deleteRowsAction?: React.MouseEventHandler<HTMLButtonElement>
}

export function DataTableToolbar<TData>({
  table,
  filterableColumns = [],
  searchableColumns = [],
  columnLabels,
  newRowLink,
  deleteRowsAction,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [isPending, startTransition] = React.useTransition()

  const handleGlobalSearch = React.useCallback(
    (value: string) => {
      searchableColumns.forEach((column) => {
        const columnId = String(column.id)
        table.getColumn(columnId)?.setFilterValue(value)
      })
    },
    [searchableColumns, table]
  )

  const currentSearchValue = searchableColumns.length > 0
    ? (table.getColumn(String(searchableColumns[0].id))?.getFilterValue() as string) ?? ""
    : ""

  return (
    <div className="flex w-full items-center justify-between gap-2 p-1.5">
      <div className="flex flex-1 items-center gap-2">
        {searchableColumns.length > 0 && (
          <div className="relative flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Tìm kiếm..."
                value={currentSearchValue}
                onChange={(event) => handleGlobalSearch(event.target.value)}
                className="h-10 w-full pl-9 pr-4 text-sm rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:ring-offset-0"
              />
            </div>
          </div>
        )}
        {filterableColumns.length > 0 && (
          <div className="flex items-center">
            <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Lọc:</span>
            {filterableColumns.map(
              (column) =>
                table.getColumn(column.id ? String(column.id) : "") && (
                  <DataTableFacetedFilter
                    key={String(column.id)}
                    column={table.getColumn(column.id ? String(column.id) : "")}
                    title={column.title}
                    options={column.options}
                  />
                )
            )}
          </div>
        )}
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => table.resetColumnFilters()}
          >
            Xóa bộ lọc
            <Cross2Icon className="ml-1.5 h-3 w-3" aria-hidden="true" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {deleteRowsAction && table.getSelectedRowModel().rows.length > 0 ? (
          <Button
            aria-label="Delete selected rows"
            variant="outline"
            size="sm"
            className="h-8 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/50 text-xs"
            onClick={(event) => {
              startTransition(() => {
                table.toggleAllPageRowsSelected(false)
                deleteRowsAction(event)
              })
            }}
            disabled={isPending}
          >
            <TrashIcon className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Xóa mục đã chọn
          </Button>
        ) : newRowLink ? (
          <Link aria-label="Create new row" href={newRowLink}>
            <div
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "h-8 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/50 text-xs",
                })
              )}
            >
              <PlusCircledIcon className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Làm mới
            </div>
          </Link>
        ) : null}
        <DataTableViewOptions table={table} columnLabels={columnLabels} />
      </div>
    </div>
  )
}