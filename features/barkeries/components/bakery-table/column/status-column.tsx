import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { IBarkery } from "@/features/barkeries/types/barkeries-type";
import { Row, type Column } from "@tanstack/react-table";

export const statusColumn = {
  accessorKey: "status",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Trạng thái" />
  ),
  cell: ({ row }: { row: Row<IBarkery> }) => {
    return (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("status")}
        </span>
      </div>
    );
  },
  enableSorting: false,
  enableHiding: false,
  filterFn: (row: Row<IBarkery>, columnId: string, filterValue: IBarkery[]) => {
    return filterValue.includes(row.getValue(columnId));
  },
} as const;

export default statusColumn;
