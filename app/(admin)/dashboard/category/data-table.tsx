"use client";

import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="w-full">
            <div className="rounded-lg border border-border/50 bg-card shadow-sm hidden md:block">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className="border-b border-border/50 bg-muted/30 hover:bg-muted/50"
                            >
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="h-12 px-6 text-left align-middle font-semibold text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                    className={`
                                        border-b border-border/30 transition-colors hover:bg-muted/30 
                                        data-[state=selected]:bg-muted/50
                                        ${index % 2 === 0 ? "bg-background" : "bg-muted/10"}
                                    `}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="px-6 py-4 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-32 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <div className="rounded-full bg-muted p-3">
                                            <svg
                                                className="h-6 w-6 text-muted-foreground"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-foreground">
                                                No data available
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                There are no records to display
                                                at the moment.
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* responsive table */}
            <div className="md:hidden rounded-md border">
                {/* <div className="flex justify-between items-center border-b"> */}
                {/*     <h2 className="px-4 py-4 font-semibold text-xl">{name}</h2> */}
                {/*     <div className="relative flex items-center py-4"> */}
                {/* <Input */}
                {/*   placeholder="Filtrer par ref ou client..." */}
                {/*   value={globalFilter ?? ""} */}
                {/*   onChange={(e) => { */}
                {/*     setGlobalFilter(e.target.value); */}
                {/*   }} */}
                {/*   className="w-36 px-4 mr-8 py-1 placeholder:text-xs md:placeholder:text-[14px] h-10 md:h-12" */}
                {/* /> */}
                {/* <Filter */}
                {/*   size={15} */}
                {/*   className="absolute text-gray-400 right-10 md:right-12" */}
                {/* /> */}
                {/*     </div> */}
                {/* </div> */}
                <Table>
                    <TableHeader>
                        <TableRow className="py-4 px-4">
                            <TableHead>Category name</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    <TableCell
                                        className="py-4 px-4"
                                        key="venteRef"
                                    >
                                        {row.getValue("name")}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={2}
                                    className="h-24 text-center"
                                >
                                    Aucun résultat
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
