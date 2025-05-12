import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { IOrder } from "@/features/orders/types/order-type";
import { Row, type Column } from "@tanstack/react-table";
import { ShoppingCart, Palette } from "lucide-react";

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

    return (
      <div className="flex items-center space-x-2">
        {isCustomOrder ? (
          <>
            <Palette className="w-4 h-4 text-pink-500" />
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {orderCode}
            </span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {orderCode}
            </span>
          </>
        )}
      </div>
    );
  },
  enableSorting: true,
  enableHiding: false,
} as const;

export default orderCodeColumn;
