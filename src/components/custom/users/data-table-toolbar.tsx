"use client"

import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/custom/table/data-table-view-options";
import { status_types, user_role } from "@/lib/dms/data";
import { DataTableFacetedFilter } from "@/components/custom/table/data-table-faceted-filter";
import { Icons } from "@/components/ui/icons";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    onAdd?: () => void;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filter users..."
                    value={(table.getColumn("profile")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("profile")?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {table.getColumn("status") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("status")}
                        title="Status"
                        options={status_types.map((status) => ({
                            value: status.value,
                            label: status.label
                        }))}
                    />
                )}
                {table.getColumn("role") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("role")}
                        title="Role"
                        options={user_role.map((type) => ({
                            value: type.value,
                            label: type.label
                        }))}
                    />
                )}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <Icons.cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    );
}