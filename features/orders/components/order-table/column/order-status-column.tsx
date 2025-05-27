import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { IOrder } from "@/features/orders/types/order-type";
import { Row, type Column } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

export const orderStatusColumn = {
  accessorKey: "order_status",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Trạng thái" />
  ),
  cell: ({ row }: { row: Row<IOrder> }) => {
    const status = row.original.order_status || "";

    // Define status styling based on status value
    const getStatusInfo = (status: string) => {
      if (!status)
        return {
          label: "Không xác định",
          bgColor: "bg-gray-100 dark:bg-gray-800",
          textColor: "text-gray-700 dark:text-gray-300",
        };

      switch (status.toUpperCase()) {
        case "PENDING":
          return {
            label: "Chờ xử lý",
            bgColor: "bg-yellow-500",
            textColor: "text-white",
          };
        case "PROCESSING":
          return {
            label: "Đang xử lý",
            bgColor: "bg-blue-500",
            textColor: "text-white",
          };
        case "COMPLETED":
        case "HOÀN THÀNH":
          return {
            label: "Hoàn thành",
            bgColor: "bg-green-500",
            textColor: "text-white",
          };
        case "CANCELLED":
        case "CANCELED":
          return {
            label: "Đã hủy",
            bgColor: "bg-red-500",
            textColor: "text-white",
          };
        case "DELIVERING":
        case "SHIPPING":
          return {
            label: "Đang giao",
            bgColor: "bg-purple-500",
            textColor: "text-white",
          };
        case "SHIPPING_COMPLETED":
          return {
            label: "Giao hàng hoàn tất",
            bgColor: "bg-emerald-500",
            textColor: "text-white",
          };
        case "REPORT_PENDING":
          return {
            label: "Khiếu nại đang xử lý",
            bgColor: "bg-yellow-500",
            textColor: "text-white",
          };
        case "FAULTY":
          return {
            label: "Đơn hàng lỗi",
            bgColor: "bg-red-500",
            textColor: "text-white",
          };
        case "READY_FOR_PICKUP":
          return {
            label: "Sẵn sàng nhận",
            bgColor: "bg-indigo-500",
            textColor: "text-white",
          };
        case "WAITING_BAKERY_CONFIRM":
          return {
            label: "Đợi xác nhận",
            bgColor: "bg-yellow-500",
            textColor: "text-white",
          };
        default:
          // For any other value, just use the value directly
          return {
            label: status,
            bgColor: "bg-gray-500",
            textColor: "text-white",
          };
      }
    };

    // Check if status is "Chờ xử lý" in the incoming data
    const isWaiting = status.toLowerCase() === "chờ xử lý";

    // Get status info
    const statusInfo = getStatusInfo(status);

    return (
      <div className="flex">
        <span
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap",
            statusInfo.bgColor,
            statusInfo.textColor
          )}
        >
          {isWaiting ? "Chờ xử lý" : statusInfo.label}
        </span>
      </div>
    );
  },
  enableSorting: true,
  enableHiding: false,
} as const;

export default orderStatusColumn;
