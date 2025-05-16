import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { IOrder } from "@/features/orders/types/order-type";
import { Row, type Column } from "@tanstack/react-table";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const cusNameColumn = {
  accessorKey: "customer.name",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Tên khách hàng" />
  ),
  cell: ({ row }: { row: Row<IOrder> }) => {
    const customer = row.original.customer || {};
    const customerName = customer.name || "Không xác định";
    const customerId = customer.id || row.original.customer_id || "";

    // Truncate long customer names
    const displayName =
      customerName.length > 10
        ? `${customerName.slice(0, 10)}...`
        : customerName;

    const displayCustomerId = customerId ? customerId.slice(0, 6) : "N/A";

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium text-foreground text-xs">
                  {displayName}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground ml-4">
                #{displayCustomerId}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">
            <div className="text-xs">
              <p className="font-medium">{customerName}</p>
              <p className="text-muted-foreground">#{customerId}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
  enableSorting: false,
  enableHiding: false,
} as const;

export default cusNameColumn;
