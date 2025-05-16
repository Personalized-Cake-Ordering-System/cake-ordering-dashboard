import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { IOrder } from "@/features/orders/types/order-type";
import { Row, type Column } from "@tanstack/react-table";
import { MapPin } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const shippingAddressColumn = {
  accessorKey: "shipping_address",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Địa chỉ giao hàng" />
  ),
  cell: ({ row }: { row: Row<IOrder> }) => {
    const address = row.original.shipping_address || "";

    // Truncate address and show only district + city when possible
    const processAddress = (addr: string) => {
      if (!addr) return "Không có địa chỉ";

      // Try to extract district and city from the address
      const parts = addr.split(",").map((part) => part.trim());
      if (parts.length >= 2) {
        // Return the last 2 parts (typically district and city)
        return parts.slice(-2).join(", ");
      }

      // Fallback to simple truncation
      return addr.length > 15 ? `${addr.substring(0, 15)}...` : addr;
    };

    const displayAddress = processAddress(address);

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 max-w-full">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-red-500" />
              <span className="text-xs truncate font-medium">
                {!address ? "Không có địa chỉ" : displayAddress}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="start" className="max-w-xs">
            <p className="text-xs">{address || "Không có địa chỉ"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
  enableSorting: false,
  enableHiding: false,
} as const;

export default shippingAddressColumn;
