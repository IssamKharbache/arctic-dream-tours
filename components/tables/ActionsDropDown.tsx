import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import DeleteActionButton from "./DeleteActionButton";
import { baseUrl } from "@/utils/baseUrl";

interface TableActionsProps {
  deleteEndpoint?: string;
  id: string;
  name: string;
}
const ActionsDropDown = ({ deleteEndpoint, name }: TableActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-2 focus:outline-none focus:border-none py-4 mt-2 mr-2"
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {deleteEndpoint && (
          <DropdownMenuItem className="py-4 px-4">
            <DeleteActionButton
              endpoint={`${baseUrl}/api/${deleteEndpoint}`}
              title={name}
            />
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        {/* <Link
          href={`/dashboard/activities/modify/${slug}`}
          className="w-full cursor-pointer hidden md:flex"
        >
          <DropdownMenuItem className="flex items-center gap-2 py-4 px-4">
            <UserPen />
            <span>Edit</span>
          </DropdownMenuItem>
        </Link> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionsDropDown;
