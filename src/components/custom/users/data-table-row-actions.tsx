"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { userSchema } from "@/lib/faker/users/schema"
import { status_types } from "@/lib/faker/users/data"

interface DataTableRowActionsProps<TData> {
    row: Row<TData>
}

export function DataTableRowActions<TData>({
    row,
}: DataTableRowActionsProps<TData>) {
    const user = userSchema.parse(row.original)

    const handleAction = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    };

    // Function to copy user ID
    const handleCopyId = () => {
        navigator.clipboard.writeText(user.id);
        toast.success("User ID copied to clipboard");
    };

    // Function to view document
    const handleView = () => {
        toast.info("View functionality coming soon");
    };

    // Function to edit user
    const handleEdit = () => {
        toast.info("Edit functionality coming soon");
    };

    // Function to change user status
    const handleStatusChange = (newStatus: string) => {
        toast.info(`Status change to ${newStatus} coming soon`);
    };

    // Function to delete user
    const handleDelete = () => {
        toast.info("Delete functionality coming soon");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                    onClick={(e) => e.stopPropagation()}
                >
                    <DotsHorizontalIcon className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem
                    onClick={(e) => handleAction(e, handleCopyId)}
                >
                    Copy ID
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={(e) => handleAction(e, handleView)}
                >
                    View
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={(e) => handleAction(e, handleEdit)}
                >
                    Edit User
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger onClick={(e) => e.stopPropagation()}>
                        Change Status
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuRadioGroup value={user.status}>
                            {status_types.map((status) => (
                                <DropdownMenuRadioItem
                                    key={status.value}
                                    value={status.value}
                                    onClick={(e) => handleAction(e, () =>
                                        handleStatusChange(status.value)
                                    )}
                                >
                                    {status.label}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={(e) => handleAction(e, handleDelete)}
                >
                    Delete
                    <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}