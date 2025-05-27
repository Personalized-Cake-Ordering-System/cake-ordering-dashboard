"use client";

import { useEffect, useState } from "react";
import { useModal } from "@/hooks/use-modal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IBarkery } from "@/features/barkeries/types/barkeries-type";
import {
  approveBakery,
  getBakery,
  notApproveBakery,
} from "@/features/barkeries/actions/barkeries-action";
import { CheckCircle, Loader2, ExternalLink, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function BakeryDetailModal() {
  const { isOpen, onClose, type, data } = useModal();
  const [bakery, setBakery] = useState<IBarkery | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const isModalOpen = isOpen && type === "bakeryDetailModal";
  const bakeryId = data.bakeryId as string;

  useEffect(() => {
    const fetchBakeryDetail = async () => {
      if (isModalOpen && bakeryId) {
        setIsLoading(true);
        try {
          const response = await getBakery(bakeryId);

          if (response.data) {
            setBakery(response.data);
          } else {
            toast({
              title: "Lỗi",
              description: "Không thể tải thông tin cửa hàng",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error fetching bakery:", error);
          toast({
            title: "Lỗi",
            description: "Đã xảy ra lỗi khi tải dữ liệu cửa hàng",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBakeryDetail();
  }, [isModalOpen, bakeryId, toast]);

  const handleApprove = async () => {
    if (!bakery) return;

    setIsApproving(true);
    try {
      const result = await approveBakery(bakery.id);

      if (result.success) {
        toast({
          title: "Thành công",
          description: "Đã phê duyệt cửa hàng thành công",
        });
        onClose();
        router.refresh();
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể phê duyệt cửa hàng",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error approving bakery:", error);
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi phê duyệt cửa hàng",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!bakery) return;
    setIsRejecting(true);
    try {
      const result = await notApproveBakery(bakery.id);
      if (result.success) {
        toast({
          title: "Đã từ chối",
          description: "Cửa hàng đã bị từ chối phê duyệt",
        });
        onClose();
        router.refresh();
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể từ chối cửa hàng",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error rejecting bakery:", error);
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi từ chối cửa hàng",
        variant: "destructive",
      });
    } finally {
      setIsRejecting(false);
    }
  };

  const openImageInNewTab = (url: string) => {
    window.open(url, "_blank");
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "N/A";
    // Convert "HH:MM:SS" to "HH:MM"
    return timeString.substring(0, 5);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-200">
            Đã phê duyệt
          </Badge>
        );
      case "BANNED":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 border-red-200">
            Đã cấm
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 border-yellow-200">
            Chờ xác nhận
          </Badge>
        );
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[85vh] !h-auto p-0 overflow-hidden flex flex-col gap-0">
        <DialogHeader className="p-3 pb-1.5 shrink-0 border-b">
          <DialogTitle className="text-sm">Thông tin cửa hàng</DialogTitle>
          <DialogDescription className="text-xs">
            Xem chi tiết và phê duyệt cửa hàng
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden min-h-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="size-6 animate-spin" />
            </div>
          ) : !bakery ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-xs text-muted-foreground">
                Không tìm thấy thông tin cửa hàng
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(85vh-8rem)]">
              <div className="p-3 space-y-2">
                {/* Basic Info */}
                <div className="flex gap-1.5 items-start">
                  <Avatar className="size-8 border">
                    <AvatarImage
                      src={bakery.avatar_file?.file_url || ""}
                      alt={bakery.bakery_name}
                    />
                    <AvatarFallback className="text-[10px]">
                      {bakery.bakery_name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-1 flex-wrap">
                      <h3 className="text-sm font-bold truncate">{bakery.bakery_name}</h3>
                      {getStatusBadge(bakery.status)}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      Chủ: {bakery.owner_name}
                    </p>
                    <div className="flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3 shrink-0" />
                      <span className="truncate">
                        {formatTime(bakery.open_time)} - {formatTime(bakery.close_time)}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className="my-1" />

                {/* Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {/* Left Column */}
                  <div className="space-y-2">
                    {/* Contact Info */}
                    <Card className="shadow-sm border">
                      <CardHeader className="py-1.5 px-2">
                        <CardTitle className="text-xs">Thông tin liên hệ</CardTitle>
                      </CardHeader>
                      <CardContent className="py-1 px-2 space-y-1">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Email</p>
                          <p className="text-xs break-all">{bakery.email}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Số điện thoại</p>
                          <p className="text-xs">{bakery.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Địa chỉ</p>
                          <p className="text-xs break-words">{bakery.address}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Tọa độ</p>
                          <p className="text-xs">
                            {bakery.latitude}, {bakery.longitude}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Business Info */}
                    <Card className="shadow-sm border">
                      <CardHeader className="py-1.5 px-2">
                        <CardTitle className="text-xs">Thông tin kinh doanh</CardTitle>
                      </CardHeader>
                      <CardContent className="py-1 px-2 space-y-1">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Mô tả bánh</p>
                          <p className="text-xs">{bakery.cake_description || "Không có"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Mô tả giá</p>
                          <p className="text-xs">{bakery.price_description || "Không có"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Mô tả cửa hàng</p>
                          <p className="text-xs">{bakery.bakery_description || "Không có"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Mã số thuế</p>
                          <p className="text-xs">{bakery.tax_code || "Không có"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Số tài khoản ngân hàng</p>
                          <p className="text-xs">{bakery.bank_account || "Không có"}</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Metrics */}
                    {bakery.metric && (
                      <Card className="shadow-sm border">
                        <CardHeader className="py-1.5 px-2">
                          <CardTitle className="text-xs">Thống kê</CardTitle>
                        </CardHeader>
                        <CardContent className="py-1 px-2">
                          <div className="grid grid-cols-2 gap-1">
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Tổng doanh thu</p>
                              <p className="text-xs font-semibold">{bakery.metric.total_revenue.toLocaleString()} đ</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Doanh thu ứng dụng</p>
                              <p className="text-xs font-semibold">{bakery.metric.app_revenue.toLocaleString()} đ</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Số đơn hàng</p>
                              <p className="text-xs font-semibold">{bakery.metric.orders_count}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Số khách hàng</p>
                              <p className="text-xs font-semibold">{bakery.metric.customers_count}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Đánh giá trung bình</p>
                              <p className="text-xs font-semibold">{bakery.metric.rating_average}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Giá trị đơn hàng TB</p>
                              <p className="text-xs font-semibold">{bakery.metric.average_order_value.toLocaleString()} đ</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-2">
                    {/* ID Documents */}
                    <Card className="shadow-sm border">
                      <CardHeader className="py-1.5 px-2">
                        <CardTitle className="text-xs">Giấy tờ tùy thân</CardTitle>
                      </CardHeader>
                      <CardContent className="py-1 px-2 space-y-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-0.5">Số CMND/CCCD</p>
                          <p className="text-xs mb-1">{bakery.identity_card_number}</p>
                          
                          <div className="grid grid-cols-2 gap-1">
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-0.5">Mặt trước</p>
                              {bakery.front_card_file ? (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                        className="h-16 rounded-md overflow-hidden bg-muted cursor-pointer relative group"
                                        onClick={() => openImageInNewTab(bakery.front_card_file?.file_url || "")}
                                      >
                                        <img
                                          src={bakery.front_card_file.file_url || ""}
                                          alt="CMND mặt trước"
                                          className="w-full h-full object-contain"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                          <ExternalLink className="text-white h-3 w-3" />
                                        </div>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="text-xs p-1">
                                      Xem ảnh đầy đủ
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                <div className="h-16 rounded-md bg-muted flex items-center justify-center">
                                  <p className="text-xs text-muted-foreground">Không có hình ảnh</p>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-0.5">Mặt sau</p>
                              {bakery.back_card_file ? (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                        className="h-16 rounded-md overflow-hidden bg-muted cursor-pointer relative group"
                                        onClick={() => openImageInNewTab(bakery.back_card_file?.file_url || "")}
                                      >
                                        <img
                                          src={bakery.back_card_file.file_url || ""}
                                          alt="CMND mặt sau"
                                          className="w-full h-full object-contain"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                          <ExternalLink className="text-white h-3 w-3" />
                                        </div>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="text-xs p-1">
                                      Xem ảnh đầy đủ
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                <div className="h-16 rounded-md bg-muted flex items-center justify-center">
                                  <p className="text-xs text-muted-foreground">Không có hình ảnh</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Certificates */}
                    <Card className="shadow-sm border">
                      <CardHeader className="py-1.5 px-2">
                        <CardTitle className="text-xs">Giấy phép & Chứng nhận</CardTitle>
                      </CardHeader>
                      <CardContent className="py-1 px-2 space-y-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-0.5">Giấy phép kinh doanh</p>
                          {bakery.business_license_file ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    className="h-16 rounded-md overflow-hidden bg-muted cursor-pointer relative group"
                                    onClick={() => openImageInNewTab(bakery.business_license_file?.file_url || "")}
                                  >
                                    <img
                                      src={bakery.business_license_file.file_url || ""}
                                      alt="Giấy phép kinh doanh"
                                      className="w-full h-full object-contain"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <ExternalLink className="text-white h-3 w-3" />
                                    </div>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-xs p-1">
                                  Xem ảnh đầy đủ
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <div className="h-16 rounded-md bg-muted flex items-center justify-center">
                              <p className="text-xs text-muted-foreground">Không có hình ảnh</p>
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-0.5">Giấy chứng nhận an toàn thực phẩm</p>
                          {bakery.food_safety_certificate_file ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    className="h-16 rounded-md overflow-hidden bg-muted cursor-pointer relative group"
                                    onClick={() => openImageInNewTab(bakery.food_safety_certificate_file?.file_url || "")}
                                  >
                                    <img
                                      src={bakery.food_safety_certificate_file.file_url || ""}
                                      alt="Giấy chứng nhận an toàn thực phẩm"
                                      className="w-full h-full object-contain"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <ExternalLink className="text-white h-3 w-3" />
                                    </div>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-xs p-1">
                                  Xem ảnh đầy đủ
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <div className="h-16 rounded-md bg-muted flex items-center justify-center">
                              <p className="text-xs text-muted-foreground">Không có hình ảnh</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Shop Images */}
        
              </div>
            </ScrollArea>
          )}
        </div>

        <DialogFooter className="p-3 pt-1.5 border-t shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            size="sm"
            className="h-7 text-xs px-2"
          >
            Đóng
          </Button>
          {bakery && bakery.status === "PENDING" && (
            <>
              <Button
                onClick={handleApprove}
                disabled={isApproving || isRejecting}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs px-2"
              >
                {isApproving ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    <span>Đang xử lý</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-1 h-3 w-3" />
                    <span>Phê duyệt</span>
                  </>
                )}
              </Button>
              <Button
                onClick={handleReject}
                disabled={isApproving || isRejecting}
                size="sm"
                variant="destructive"
                className="h-7 text-xs px-2 ml-2"
              >
                {isRejecting ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    <span>Đang từ chối</span>
                  </>
                ) : (
                  <>
                    <span>Từ chối</span>
                  </>
                )}
              </Button>
            </>
          )}
          {bakery && bakery.status === "CONFIRMED" && (
            <Button
              disabled
              size="sm"
              className="bg-green-600 text-white cursor-not-allowed h-7 text-xs px-2"
            >
              <CheckCircle className="mr-1 h-3 w-3" />
              <span>Đã phê duyệt</span>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
