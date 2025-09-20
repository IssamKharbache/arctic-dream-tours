"use client";

import ActionsDropDown from "@/components/tables/ActionsDropDown";
import { Activity, Blog } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
export const columns: ColumnDef<Blog>[] = [
  {
    accessorKey: "title",
    header: "Blog Title",
  },
  {
    accessorKey: "coverImage",
    header: "Activity description",
    cell: ({ row }) => (
      <Image
        src={row.original.coverImage || ""}
        alt="cover image"
        width={400}
        height={400}
      />
    ),
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const blog = row.original;
      return (
        <ActionsDropDown
          name="Blog"
          id={blog.slug}
          deleteEndpoint={`blog/${blog.slug}/delete`}
        />
      );
    },
  },
];
