import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { TransactionType } from "@/features/transactions/types/transaction-type";
import { Row, type Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";

export const amountColumn = {
  accessorKey: "amount",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="-ml-3 h-8 font-bold text-base"
    >
      Số tiền
      <CaretSortIcon className="ml-2 h-4 w-4" />
    </Button>
  ),
  cell: ({ row }: { row: Row<TransactionType> }) => {
    return (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {/* // fotmat làm tron 2 số thập phân */}
          {Number(row.getValue("amount")).toFixed(2)} đ
        </span>
      </div>
    );
  },
  enableSorting: true,
  enableHiding: false,
  filterFn: (
    row: Row<TransactionType>,
    columnId: string,
    filterValue: TransactionType[]
  ) => {
    return filterValue.includes(row.getValue(columnId));
  },
} as const;

export default amountColumn;
