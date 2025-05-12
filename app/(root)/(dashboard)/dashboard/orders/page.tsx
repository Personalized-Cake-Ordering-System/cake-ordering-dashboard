import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Shell } from "@/components/shared/custom-ui/shell";
import { getCakes } from "@/features/cakes/actions/cake-action";
import { getOrders } from "@/features/orders/actions/order-action";
import { SearchParams } from "@/types/table";
import React, { Suspense } from "react";
import { OrderTable } from "@/features/orders/components/order-table/order-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, Clock, Truck } from "lucide-react";

export interface IndexPageProps {
  searchParams: SearchParams;
}

const OrdersPage = ({ searchParams }: IndexPageProps) => {
  const orderData = getOrders(searchParams);

  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-green-800 dark:text-green-400">
            Quản lý đơn hàng
          </h1>
          <div className="flex gap-2">
            <button className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500">
              <Package className="mr-2 h-4 w-4" />
              Xuất báo cáo
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white dark:bg-gray-800 border-green-100 dark:border-green-800">
            <CardContent className="flex flex-row items-center p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <ShoppingBag className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div className="ml-4">
                <CardTitle className="text-xl font-medium text-gray-700 dark:text-gray-200">
                  Tổng đơn hàng
                </CardTitle>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">247</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border-yellow-100 dark:border-yellow-800">
            <CardContent className="flex flex-row items-center p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
              </div>
              <div className="ml-4">
                <CardTitle className="text-xl font-medium text-gray-700 dark:text-gray-200">
                  Đang xử lý
                </CardTitle>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">42</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800">
            <CardContent className="flex flex-row items-center p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <Truck className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div className="ml-4">
                <CardTitle className="text-xl font-medium text-gray-700 dark:text-gray-200">
                  Đang giao
                </CardTitle>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">18</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border-purple-100 dark:border-purple-800">
            <CardContent className="flex flex-row items-center p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                <Package className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div className="ml-4">
                <CardTitle className="text-xl font-medium text-gray-700 dark:text-gray-200">
                  Đã hoàn thành
                </CardTitle>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">183</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white dark:bg-gray-800 border-green-100 dark:border-green-800 shadow-lg">
          <CardHeader className="px-6 py-4 border-b border-green-100 dark:border-green-800">
            <CardTitle className="text-xl font-semibold text-green-800 dark:text-green-400">
              Danh sách đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Suspense
              fallback={
                <DataTableSkeleton
                  columnCount={5}
                  searchableColumnCount={1}
                  filterableColumnCount={2}
                  cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
                  shrinkZero
                />
              }
            >
              <OrderTable orderPromise={orderData} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
};

export default OrdersPage;
