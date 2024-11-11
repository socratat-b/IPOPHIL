"use client";

import { Icons } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";
import { User } from "@/lib/faker/users/schema";
import { formatBadgeText } from "@/lib/controls";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./data-table-row-actions";
import { status_types, user_types } from "@/lib/faker/users/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTableColumnHeader } from "@/components/custom/table/data-table-column-header";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const columns: ColumnDef<User>[] = [
    {
        id: "profile",
        accessorFn: (row) => row,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="User" />
        ),
        cell: ({ row }) => {
            const data = row.original;
            const initials = `${data.first_name?.[0] || ''}${data.last_name?.[0] || ''}`.toUpperCase();

            return (
                <div className="flex items-center gap-3 py-1">
                    <Avatar className="h-9 w-9">
                        <AvatarImage
                            src={data.profile_url}
                            alt={`${data.first_name} ${data.last_name}`}
                        />
                        <AvatarFallback className="font-medium">
                            {initials || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex flex-col">
                                    <div className="font-medium">
                                        {`${data.first_name} ${data.last_name}`}
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <Icons.user className="h-3 w-3 text-blue-500" />
                                        <span className="text-sm text-muted-foreground">
                                            @{data.username}
                                        </span>
                                    </div>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent className="w-64">
                                <div className="space-y-1.5">
                                    <p>{`${data.first_name} ${data.last_name}`}</p>
                                    <p>Username: @{data.username}</p>
                                    <p>ID: {data.id}</p>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            );
        },
    },
    {
        id: "contact",
        accessorFn: (row) => row.email,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Contact" />
        ),
        cell: ({ row }) => {
            const data = row.original;
            return (
                <div className="flex flex-col gap-1.5">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className="flex items-center gap-1.5">
                                <Icons.mail className="w-3 h-3 text-violet-500" />
                                <span className="text-sm truncate max-w-[150px]">
                                    {data.email}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{data.email}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className="flex items-center gap-1.5">
                                <Icons.mapPin className="w-3 h-3 text-emerald-500" />
                                <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                                    {data.address}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{data.address}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            );
        },
    },
    {
        id: "position",
        accessorFn: (row) => row,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Position" />
        ),
        cell: ({ row }) => {
            const data = row.original;
            return (
                <div className="flex flex-col gap-1.5">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex flex-col gap-1.5">
                                    <div className="font-medium">
                                        {data.title}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Icons.building className="h-3 w-3 text-blue-500" />
                                        <span className="text-sm text-muted-foreground">
                                            Department {data.department_id}
                                        </span>
                                    </div>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent className="w-64">
                                <div className="space-y-1.5">
                                    <p>{data.title}</p>
                                    <p>Department: {data.department_id}</p>
                                    <p>Employee ID: {data.id}</p>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            );
        },
    },
    {
        id: "role",
        accessorKey: "role",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => {
            const role = row.original.role;
            const roleType = user_types.find((r) => r.value === role);
            return (
                <Badge
                    variant={role === "admin" ? "destructive" : "secondary"}
                    className="font-medium"
                >
                    {formatBadgeText(roleType?.label || role)}
                </Badge>
            );
        },
        filterFn: (row, id, filterValue) => {
            if (!row || (Array.isArray(row) && row.length === 0)) return true;
            return filterValue.includes(row.getValue(id));
        },
    },
    {
        id: "status",
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = row.original.status;
            const statusType = status_types.find((s) => s.value === status);
            return (
                <div className="flex items-center gap-1.5">
                    <div
                        className={`h-2 w-2 rounded-full ${status === "active" ? "bg-emerald-500" : "bg-gray-300"
                            }`}
                    />
                    <span className={`text-sm ${status === "active" ? "text-emerald-600" : "text-muted-foreground"
                        }`}>
                        {statusType?.label || status}
                    </span>
                </div>
            );
        },
        filterFn: (row, id, filterValue) => {
            if (!row || (Array.isArray(row) && row.length === 0)) return true;
            return filterValue.includes(row.getValue(id));
        },
    },
    {
        id: "dates",
        accessorFn: (row) => row,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Activity" />
        ),
        cell: ({ row }) => {
            const data = row.original;
            return (
                <div className="flex flex-col gap-1.5 text-sm">
                    <div className="flex items-center gap-1.5">
                        <Icons.calendar className="w-3 h-3 text-orange-500" />
                        <span className="text-muted-foreground">
                            {new Intl.DateTimeFormat('en-US', {
                                dateStyle: 'medium'
                            }).format(new Date(data.created_at))}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Icons.refresh className="w-3 h-3 text-blue-500" />
                        <span className="text-muted-foreground">
                            {new Intl.DateTimeFormat('en-US', {
                                dateStyle: 'medium'
                            }).format(new Date(data.updated_at))}
                        </span>
                    </div>
                </div>
            );
        },
    },
    {
        id: "actions",
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];