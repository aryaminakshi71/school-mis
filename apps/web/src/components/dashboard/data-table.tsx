"use client"

import React from "react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface Column<T> {
    key: keyof T | string
    header: string
    render?: (item: T) => React.ReactNode
    className?: string
}

interface DataTableProps<T> {
    columns: Column<T>[]
    data: T[]
    onRowClick?: (item: T) => void
}

export function DataTable<T extends { id: string | number }>({
    columns,
    data,
    onRowClick,
}: DataTableProps<T>) {
    return (
        <div className="rounded-xl border border-border overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                        {columns.map((column) => (
                            <TableHead
                                key={String(column.key)}
                                className={cn("text-muted-foreground font-medium", column.className)}
                            >
                                {column.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => (
                        <TableRow
                            key={item.id}
                            className={cn(
                                "border-border",
                                onRowClick && "cursor-pointer hover:bg-secondary/30"
                            )}
                            onClick={() => onRowClick?.(item)}
                        >
                            {columns.map((column) => (
                                <TableCell
                                    key={`${item.id}-${String(column.key)}`}
                                    className={column.className}
                                >
                                    {column.render
                                        ? column.render(item)
                                        : String(item[column.key as keyof T] ?? "")}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
