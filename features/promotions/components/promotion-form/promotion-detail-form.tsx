"use client";

import { z } from "zod";
import { IPromotion } from "../../types/promotion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  createPromotion,
  updatePromotion,
} from "../../action/promotion-action";
import {
  CalendarIcon,
  Percent,
  Package,
  Clock,
  Tag,
  Coins,
  ShoppingBag,
  FileText,
  Info,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PromotionDetailFormProps {
  initialData: IPromotion | null;
}

const promotionSchema = z.object({
  discount_percentage: z.coerce.number().min(0),
  min_order_amount: z.coerce.number().min(0),
  max_discount_amount: z.coerce.number().min(0),
  expiration_date: z.string(),
  quantity: z.coerce.number().min(0),
  usage_count: z.coerce.number().min(0),
  description: z.string().min(1, "Mô tả khuyến mãi không được để trống"),
  voucher_type: z.string().min(1, "Loại voucher không được để trống"),
});

type promotionFormValue = z.infer<typeof promotionSchema>;

const voucherType = ["PRIVATE", "GLOBAL", "SYSTEM"];
const voucherTypeLabels = {
  PRIVATE: "Riêng tư",
  GLOBAL: "Toàn cục",
  SYSTEM: "Hệ thống",
};

const PromotionDetailForm = ({ initialData }: PromotionDetailFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const isEditing = !!initialData;

  const title = isEditing
    ? "Chỉnh sửa thông tin khuyến mãi"
    : "Thêm khuyến mãi mới";
  const description = isEditing
    ? "Chỉnh sửa chi tiết thông tin khuyến mãi."
    : "Thêm một khuyến mãi mới.";
  const action = isEditing ? "Lưu thay đổi" : "Tạo mới";
  const toastMessage = isEditing
    ? "Cập nhật thành công."
    : "Tạo mới thành công.";

  // Set default values, with initial usage_count of 0
  const defaultValues = initialData
    ? initialData
    : {
        discount_percentage: 0,
        min_order_amount: 0,
        max_discount_amount: 0,
        expiration_date: "",
        quantity: 0,
        usage_count: 0,
        description: "",
        voucher_type: isAdmin ? "SYSTEM" : "PRIVATE",
      };

  const form = useForm<promotionFormValue>({
    resolver: zodResolver(promotionSchema),
    defaultValues,
  });

  // Update voucher_type when user role changes
  useEffect(() => {
    if (!initialData && isAdmin) {
      form.setValue("voucher_type", "SYSTEM");
    }
  }, [isAdmin, initialData, form]);

  const onSubmit = async (data: promotionFormValue) => {
    startTransition(async () => {
      setLoading(true);
      if (initialData) {
        await updatePromotion(data, initialData.id);
      } else {
        // Always send usage_count as 0 for new promotions
        await createPromotion({
          ...data,
          usage_count: 0,
        });
      }
      setLoading(false);
      toast.success(toastMessage);
    });
  };

  // Filter voucher types based on user role
  const availableVoucherTypes = isAdmin
    ? ["SYSTEM"]
    : voucherType.filter((type) => type !== "SYSTEM");

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-5">
          <Link href="/dashboard/promotions">
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-full px-4 py-2 transition-all hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
          </Link>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              {title}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              {description}
            </p>
          </div>
          <div
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2",
              isEditing
                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
            )}
          >
            <span className="h-2 w-2 rounded-full bg-current"></span>
            {isEditing ? "Chế độ chỉnh sửa" : "Thêm khuyến mãi mới"}
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Card 1: Discount Information */}
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border dark:border-slate-700 dark:bg-slate-900 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 dark:bg-slate-800 border-b dark:border-slate-700">
                <CardTitle className="text-xl font-semibold flex items-center gap-3 dark:text-slate-100">
                  <div className="bg-primary text-white p-2 rounded-full">
                    <Percent className="h-5 w-5" />
                  </div>
                  Thông tin giảm giá
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Thiết lập các thông số giảm giá cho voucher
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <FormField
                  control={form.control}
                  name="discount_percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                        <Percent className="h-4 w-4 text-primary" />
                        Phần trăm giảm giá
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="Nhập phần trăm giảm giá"
                            {...field}
                            className="pl-4 pr-8 focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 rounded-md"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
                            %
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="min_order_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4 text-primary" />
                        Đơn hàng tối thiểu
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="Nhập giá trị đơn hàng tối thiểu"
                            {...field}
                            className="pl-4 pr-8 focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 rounded-md"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
                            đ
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_discount_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                        <Coins className="h-4 w-4 text-primary" />
                        Giảm giá tối đa
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="Nhập giá trị giảm tối đa"
                            {...field}
                            className="pl-4 pr-8 focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 rounded-md"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
                            đ
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Card 2: Usage Details */}
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border dark:border-slate-700 dark:bg-slate-900 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 dark:from-blue-500/20 dark:to-blue-500/10 dark:bg-slate-800 border-b dark:border-slate-700">
                <CardTitle className="text-xl font-semibold flex items-center gap-3 dark:text-slate-100">
                  <div className="bg-blue-500 text-white p-2 rounded-full">
                    <Clock className="h-5 w-5" />
                  </div>
                  Chi tiết sử dụng
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Cấu hình thời gian và số lượng voucher
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <FormField
                  control={form.control}
                  name="expiration_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-blue-500" />
                        Ngày hết hạn
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="datetime-local"
                            {...field}
                            className="pl-4 focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 rounded-md"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-500" />
                        Số lượng voucher
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Nhập số lượng"
                          {...field}
                          className="focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 rounded-md"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Only show usage_count when editing */}
                {isEditing && (
                  <FormField
                    control={form.control}
                    name="usage_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-blue-500" />
                          Số lần đã sử dụng
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Nhập số lần sử dụng"
                            {...field}
                            className="focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 rounded-md"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            {/* Card 3: Voucher Details */}
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border dark:border-slate-700 dark:bg-slate-900 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-amber-500/10 to-amber-500/5 dark:from-amber-500/20 dark:to-amber-500/10 dark:bg-slate-800 border-b dark:border-slate-700">
                <CardTitle className="text-xl font-semibold flex items-center gap-3 dark:text-slate-100">
                  <div className="bg-amber-500 text-white p-2 rounded-full">
                    <Tag className="h-5 w-5" />
                  </div>
                  Chi tiết voucher
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Cấu hình loại và thông tin voucher
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <FormField
                  control={form.control}
                  name="voucher_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-amber-500" />
                        Loại voucher
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isAdmin} // Disable for all admin cases
                        >
                          <SelectTrigger className="focus:ring-2 focus:ring-amber-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 rounded-md">
                            <SelectValue placeholder="Chọn loại voucher" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                            {availableVoucherTypes.map((type) => (
                              <SelectItem
                                key={type}
                                value={type}
                                className="dark:text-slate-100 dark:hover:bg-slate-700"
                              >
                                {voucherTypeLabels[
                                  type as keyof typeof voucherTypeLabels
                                ] || type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                        <Info className="h-4 w-4 text-amber-500" />
                        Mô tả
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập mô tả khuyến mãi"
                          {...field}
                          className="min-h-32 resize-none focus:ring-2 focus:ring-amber-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 rounded-md"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Submit Button */}
          <div className="sticky bottom-0 z-10 pt-4">
            <Card className="shadow-lg border dark:border-slate-700 dark:bg-slate-900 overflow-hidden">
              <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <div
                    className={cn(
                      "p-2 rounded-full",
                      isEditing
                        ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                    )}
                  >
                    {isEditing ? (
                      <Clock className="h-5 w-5" />
                    ) : (
                      <Tag className="h-5 w-5" />
                    )}
                  </div>
                  <p className="text-sm">
                    {isEditing
                      ? "Cập nhật thông tin khuyến mãi"
                      : "Tạo một khuyến mãi mới"}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Link href="/dashboard/promotions">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-slate-300 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800 px-6"
                    >
                      Hủy
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={isPending || loading}
                    className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-white px-8 py-2 shadow-md hover:shadow-lg transition-all"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                        Đang xử lý...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        {action}
                      </span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PromotionDetailForm;
