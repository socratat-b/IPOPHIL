'use client'

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
import { useState } from "react"

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

import { documentsSchema, Document } from "@/lib/faker/documents/schema"
import { statuses } from "@/lib/faker/documents/data"
import { toast } from "sonner"
import { DocumentDialog } from "@/components/custom/common/document-dialog"

interface DataTableRowActionsProps<TData> {
    row: Row<TData>
}

export function DataTableRowActions<TData>({
    row,
}: DataTableRowActionsProps<TData>) {
    const [selectedItem, setSelectedItem] = useState<Document | null>(null);
    const document = documentsSchema.parse(row.original)

    const handleAction = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    };

    // Function to Copy Code
    const handleCopyCode = () => {
        navigator.clipboard.writeText(document.code);
        toast.success("Document Code copied to clipboard");
    };

    // Function to view document
    const handleView = () => {
        setSelectedItem(document);
    };

    // Function to edit document
    const handleEdit = () => {
        toast.info("Edit functionality coming soon");
    };

    // Function to release document
    const handleRelease = () => {
        toast.info("Release functionality coming soon");
    };

    // Function to change document status
    const handleStatusChange = (newStatus: string) => {
        toast.info(`Status change to ${newStatus} coming soon`);
    };

    // Function to delete document
    const handleDelete = () => {
        toast.info("Delete functionality coming soon");
    };

    return (
        <>
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
                        onClick={(e) => handleAction(e, handleCopyCode)}
                    >
                        Copy Code
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={(e) => handleAction(e, handleView)}
                    >
                        View
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={(e) => handleAction(e, handleEdit)}
                    >
                        Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={(e) => handleAction(e, handleRelease)}
                    >
                        Release
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger onClick={(e) => e.stopPropagation()}>
                            Change Status
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuRadioGroup value={document.status}>
                                {statuses.map((status) => (
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

            <DocumentDialog
                item={selectedItem}
                open={!!selectedItem}
                onClose={() => setSelectedItem(null)}
            />
        </>
    )
}