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
interface ActionMenuProps {
  row: Row<IBarkery>;
}

const ActionMenu = ({ row }: ActionMenuProps) => {
  const router = useRouter();
  const { onOpen } = useModal();
  const isPending = row.original.status === "PENDING";

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
