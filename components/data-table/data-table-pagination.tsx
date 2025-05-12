import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSizeOptions?: number[];
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [5, 10, 20, 30, 40, 50],
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex w-full flex-col items-center justify-between gap-2 overflow-auto px-2 py-1 sm:flex-row sm:gap-4 border-t border-gray-200 dark:border-gray-800">
      <div className="flex-1 text-sm text-gray-500 dark:text-gray-400">
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <span>
            <span className="font-medium">{table.getFilteredSelectedRowModel().rows.length}</span> trên{" "}
            <span className="font-medium">{table.getFilteredRowModel().rows.length}</span> hàng đã được chọn
          </span>
        ) : (
          <span>
            Hiển thị <span className="font-medium">{Math.min(table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)}</span> trên{" "}
            <span className="font-medium">{table.getFilteredRowModel().rows.length}</span> mục
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Hiển thị:
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-7 w-[60px] border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top" className="border-gray-200 dark:border-gray-800">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`} className="text-xs">
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1">
          <Button
            aria-label="Đi tới trang đầu tiên"
            variant="outline"
            size="icon"
            className="h-7 w-7 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hidden lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <DoubleArrowLeftIcon className="h-3 w-3" aria-hidden="true" />
          </Button>
          <Button
            aria-label="Đi tới trang trước"
            variant="outline"
            size="icon"
            className="h-7 w-7 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="h-3 w-3" aria-hidden="true" />
          </Button>
          <span className="text-sm text-gray-500 dark:text-gray-400 mx-2">
            <span className="font-medium">{table.getState().pagination.pageIndex + 1}</span>
            {" / "}
            <span className="font-medium">{table.getPageCount() || 1}</span>
          </span>
          <Button
            aria-label="Đi tới trang tiếp theo"
            variant="outline"
            size="icon"
            className="h-7 w-7 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="h-3 w-3" aria-hidden="true" />
          </Button>
          <Button
            aria-label="Đi tới trang cuối cùng"
            variant="outline"
            size="icon"
            className="h-7 w-7 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hidden lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <DoubleArrowRightIcon className="h-3 w-3" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
