'use client';

import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { DocumentType } from "@/lib/dms/schema";
import { DataTableColumnHeader } from "../table/data-table-column-header";

export const columns: ColumnDef<DocumentType>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => (
            <span className="font-medium">
                {row.original.name}
            </span>
        ),
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: "description",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Description" />
        ),
        cell: ({ row }) => (
            <span className="text-muted-foreground">
                {row.original.description || "No description"}
            </span>
        ),
        enableSorting: false,
        enableHiding: true,
    },
    {
        accessorKey: "active",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const isActive = row.original.active;
            return (
                <Badge
                    variant={isActive ? "default" : "secondary"}
                    className="font-medium"
                >
                    {isActive ? "Active" : "Inactive"}
                </Badge>
            );
        },
        enableSorting: true,
        enableHiding: true,
        filterFn: (row, id, value) => {
            // Only filter if value is not undefined (filter is active)
            if (value === undefined) return true;
            return row.getValue(id) === value;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />,
        enableSorting: false,
        enableHiding: false,
    },
];
