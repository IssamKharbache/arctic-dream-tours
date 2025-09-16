import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserPen } from "lucide-react";
import React from "react";
import DeleteActionButton from "./DeleteActionButton";
import { baseUrl } from "@/utils/baseUrl";
import { useEditDialogStore } from "@/store/zustand/editDialogStore";

interface TableActionsProps {
    deleteEndpoint?: string;
    id: string;
    name: string;
}
const ActionsDropDown = ({ deleteEndpoint, id, name }: TableActionsProps) => {
    const { openDialog } = useEditDialogStore();

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
                {/* <button className="w-full cursor-pointer">
                    <DropdownMenuItem
                        onClick={() => openDialog(id)}
                        className="flex items-center gap-2 py-4 px-4"
                    >
                        <UserPen />
                        <span>Edit</span>
                    </DropdownMenuItem>
                </button> */}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ActionsDropDown;
