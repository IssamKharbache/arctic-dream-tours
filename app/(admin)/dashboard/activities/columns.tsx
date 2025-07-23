"use client";

import ActionsDropDown from "@/components/tables/ActionsDropDown";
import { Activity } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
export const columns: ColumnDef<Activity>[] = [
    {
        accessorKey: "imageUrl",
        header: "Activity image",
        cell: ({ row }) => (
            <div className="w-60 h-24 rounded overflow-hidden">
                <Image
                    src={row.original.imageUrl}
                    alt={row.original.title}
                    width={1200}
                    height={1200}
                    className="w-full h-full object-cover rounded"
                />
            </div>
        ),
    },

    {
        accessorKey: "title",
        header: "Activity Title",
    },
    {
        accessorKey: "shortDescription",
        header: "Activity description",
        cell: ({ row }) => (
            <div className="text-sm w-72 truncate break-words line-clamp-2 overflow-hidden">
                {row.getValue("shortDescription")}
            </div>
        ),
    },

    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const activity = row.original;
            return (
                <ActionsDropDown
                    name="Activity"
                    id={activity.id}
                    deleteEndpoint={`activity/delete/${activity.id}`}
                />
            );
        },
    },
];
