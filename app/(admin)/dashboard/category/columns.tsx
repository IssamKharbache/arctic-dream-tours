"use client";

import ActionsDropDown from "@/components/tables/ActionsDropDown";
import { Category } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Category>[] = [
    {
        accessorKey: "name",
        header: "Category name",
    },
    {
        accessorKey: "description",
        header: "Category Description",
        cell: ({ row }) => (
            <div className="text-sm w-72 truncate break-words line-clamp-2 overflow-hidden">
                {row.getValue("description")}
            </div>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const category = row.original;
            return (
                <ActionsDropDown
                    name="Category"
                    id={category.id}
                    deleteEndpoint={`category/delete/${category.id}`}
                />
            );
        },
    },
];
