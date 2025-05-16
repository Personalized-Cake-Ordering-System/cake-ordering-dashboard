import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { IOrder } from "@/features/orders/types/order-type";
import { Row, type Column } from "@tanstack/react-table";
import { ShoppingCart, Palette } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const orderCodeColumn = {
  accessorKey: "order_code",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Mã đơn hàng" />
  ),
  cell: ({ row }: { row: Row<IOrder> }) => {
    const order = row.original;
    const orderCode = order.order_code || "N/A";

    // Kiểm tra nếu là đơn hàng custom dựa vào order_details
    const hasOrderDetails = Boolean(
      order?.order_details && Array.isArray(order.order_details)
    );

    let isCustomOrder = false;
    if (hasOrderDetails && order.order_details.length > 0) {
      // Đơn hàng được coi là custom nếu có ít nhất một order detail với custom_cake_id
      isCustomOrder = order.order_details.some(
        (detail) => detail.custom_cake_id && detail.available_cake === null
      );
    }

    // Truncate long order codes - display last 8 digits
    const displayCode =
      orderCode.length > 10 ? `...${orderCode.slice(-8)}` : orderCode;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center space-x-1">
              {isCustomOrder ? (
                <>
                  <Palette className="w-3.5 h-3.5 text-pink-500" />
                  <span className="font-medium text-gray-900 dark:text-gray-100 text-xs">
                    {displayCode}
                  </span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5 text-blue-500" />
                  <span className="font-medium text-gray-900 dark:text-gray-100 text-xs">
                    {displayCode}
                  </span>
                </>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs font-medium">{orderCode}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
  enableSorting: true,
  enableHiding: false,
} as const;

export default orderCodeColumn;
