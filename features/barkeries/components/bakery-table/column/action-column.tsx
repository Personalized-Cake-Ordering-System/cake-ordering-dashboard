"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Contact, Edit, Trash2, Eye, CheckCircle } from "lucide-react";
// import { IUser } from "@/features/users/types/user-type";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useModal } from "@/hooks/use-modal";
import { useSession } from "next-auth/react";
import { IBarkery } from "@/features/barkeries/types/barkeries-type";
import { useRouter } from "nextjs-toploader/app";
import { banBakery } from "@/features/barkeries/actions/barkeries-action";
import { useToast } from "@/components/ui/use-toast";
import React from "react";

interface ActionMenuProps {
  row: Row<IBarkery>;
}

const ActionMenu = ({ row }: ActionMenuProps) => {
  const router = useRouter();
  const { onOpen } = useModal();
  const isPending = row.original.status === "PENDING";
  const { toast } = useToast();
  const [isBanning, setIsBanning] = React.useState(false);

  const handleBanToggle = async () => {
    setIsBanning(true);
    const isBanned = row.original.status === "BANNED";
    const action = isBanned ? "UN_BAN" : "BAN";
    try {
      const result = await banBakery(row.original.id, action);
      if (result.success) {
        toast({
          title: isBanned ? "Đã bỏ cấm cửa hàng" : "Đã cấm cửa hàng",
          description: isBanned ? "Cửa hàng đã được mở lại!" : "Cửa hàng đã bị cấm thành công!",
        });
        router.refresh();
      } else {
        toast({
          title: "Lỗi",
          description: result.error || (isBanned ? "Không thể bỏ cấm cửa hàng" : "Không thể cấm cửa hàng"),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: isBanned ? "Đã xảy ra lỗi khi bỏ cấm cửa hàng" : "Đã xảy ra lỗi khi cấm cửa hàng",
        variant: "destructive",
      });
    } finally {
      setIsBanning(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Open actions menu"
          variant="ghost"
          className="flex size-8 p-0 hover:bg-accent/50 focus:ring-2 focus:ring-primary/30"
        >
          <DotsHorizontalIcon className="size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[180px] border shadow-md rounded-md"
      >
        {isPending && (
          <DropdownMenuItem
            onClick={() =>
              onOpen("bakeryDetailModal", { bakeryId: row.original.id })
            }
            className="cursor-pointer hover:bg-accent/50 focus:bg-accent/50"
          >
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            <span>Xét duyệt</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          onClick={() => router.push(`/dashboard/bakeries/${row.original.id}`)}
          className="cursor-pointer hover:bg-accent/50 focus:bg-accent/50"
        >
          <Contact className="mr-2 h-4 w-4 text-green-500" />
          <span>Chi tiết</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleBanToggle}
          disabled={isBanning}
          className={
            row.original.status === "BANNED"
              ? "cursor-pointer hover:bg-green-100 focus:bg-green-100 text-green-600"
              : "cursor-pointer hover:bg-red-100 focus:bg-red-100 text-red-600"
          }
        >
          <Trash2 className={
            row.original.status === "BANNED"
              ? "mr-2 h-4 w-4 text-green-500"
              : "mr-2 h-4 w-4 text-red-500"
          } />
          {isBanning
            ? (row.original.status === "BANNED" ? "Đang mở lại..." : "Đang cấm...")
            : (row.original.status === "BANNED" ? "Bỏ cấm" : "Cấm cửa hàng")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const actionColumn: ColumnDef<IBarkery> = {
  id: "actions",
  cell: ({ row }) => <ActionMenu row={row} />,
  enableSorting: false,
  enableHiding: false,
} as const;

export default actionColumn;
