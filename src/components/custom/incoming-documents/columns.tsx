"use client"

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/custom/table/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Document } from "@/lib/faker/documents/schema";
import { Badge } from "@/components/ui/badge";
import { classifications } from "@/lib/faker/documents/data";
import DocumentCodeCell from "../code-cell/document-code-cell";

export const columns: ColumnDef<Document>[] = [
    {
        id: "print-code",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Scan" />
        ),
        cell: ({ row }) => {
            const code = row.getValue("code") as string;
            return <DocumentCodeCell code={code} />;
        },
        enableSorting: false,
    },
    {
        accessorKey: "code",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Code" />
        ),
        cell: ({ row }) => {
            const code = row.getValue("code") as string;
            return <span title={`Code: ${code}`}>{code}</span>;
        },
    },
    {
        accessorKey: "origin_office",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Origin Office" />
        ),
        cell: ({ row }) => {
            const originOffice = row.getValue("origin_office") as string;
            return <span title={`Origin Office: ${originOffice}`}>{originOffice}</span>;
        },
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Subject/Title" />
        ),
        cell: ({ row }) => {
            const title = row.getValue("title") as string;
            return <span className="font-medium" title={`Title: ${title}`}>{title}</span>;
        },
    },
    {
        accessorKey: "classification",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Classification" />
        ),
        cell: ({ row }) => {
            const categoryValue = row.getValue("classification") as string;
            const classification = classifications.find((cat) => cat.value === categoryValue);
            return classification ? <Badge variant={"outline"}>{classification.label}</Badge> : null;
        },
    },
    {
        accessorKey: "type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Type" />
        ),
        cell: ({ row }) => {
            const type = row.getValue("type") as string;
            return <span title={`Type: ${type}`}>{type}</span>;
        },
    },
    {
        accessorKey: "created_by",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created By" />
        ),
        cell: ({ row }) => {
            const createdBy = row.getValue("created_by") as string;
            return <span title={`Created By: ${createdBy}`}>{createdBy}</span>;
        },
    },
    {
        accessorKey: "date_created",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date Created" />
        ),
        cell: ({ row }) => {
            const dateCreated = row.getValue("date_created") as string;
            const date = new Date(dateCreated);
            return <span title={`Date Created: ${date.toDateString()}`}>{date.toDateString()}</span>;
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <div title="Row Actions">
                <DataTableRowActions row={row} />
            </div>
        ),
    },
];