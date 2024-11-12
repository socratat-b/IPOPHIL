import React from "react"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { DataPreviewProps } from "@/lib/types"
import { formatBadgeText } from "@/lib/controls/helper"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export const DataPreview: React.FC<DataPreviewProps> = ({
    filteredData,
    filters,
    onItemClick,
}) => {
    const [rowLimit, setRowLimit] = useState("5")

    const displayedData = rowLimit === "all"
        ? filteredData
        : filteredData.slice(0, parseInt(rowLimit))

    const ref = React.useRef(null);
    React.useEffect(() => {
        import("@lottiefiles/lottie-player");
    })

    return (
        <Card className="border-none shadow-none">
            <CardHeader className="pb-2 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl">Document Report</CardTitle>
                        <CardDescription className="mt-2">
                            Total Documents: {filteredData.length}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-center">
                        <span className="text-sm text-muted-foreground whitespace-nowrap">Show rows:</span>
                        <Select
                            value={rowLimit}
                            onValueChange={setRowLimit}
                        >
                            <SelectTrigger className="w-20">
                                <SelectValue placeholder="5" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="all">All</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {(filters.office || filters.classification || filters.type || (filters.date?.from && filters.date?.to)) && (
                    <div className="text-sm text-muted-foreground break-words">
                        <span className="font-medium">Filters:</span>{' '}
                        <span className="inline-flex flex-wrap gap-2">
                            {[
                                filters.office && (
                                    <span className="whitespace-nowrap">Office: {filters.office}</span>
                                ),
                                filters.classification && (
                                    <span className="whitespace-nowrap">Class: {filters.classification}</span>
                                ),
                                filters.type && (
                                    <span className="whitespace-nowrap">Type: {filters.type}</span>
                                ),
                                (filters.date?.from && filters.date?.to) && (
                                    <span className="whitespace-nowrap">
                                        Date: {filters.date.from instanceof Date && filters.date.to instanceof Date
                                            ? `${format(filters.date.from, "MMM dd")} - ${format(filters.date.to, "MMM dd, yyyy")}`
                                            : ''}
                                    </span>
                                )
                            ].filter(Boolean).map((filter, index) => (
                                <span key={index}>
                                    {index > 0 && <span className="mx-1">|</span>}
                                    {filter}
                                </span>
                            ))}
                        </span>
                    </div>
                )}
            </CardHeader>

            <CardContent>
                <div className="border p-4">
                    <div className="relative rounded-md">
                        <Table>
                            <TableHeader className="sticky top-0 bg-background border-b">
                                <TableRow>
                                    <TableHead className="w-[8%]">Code</TableHead>
                                    <TableHead className="w-[30%]">Title</TableHead>
                                    <TableHead className="w-[22%]">Created By</TableHead>
                                    <TableHead className="w-[25%]">Metadata</TableHead>
                                    <TableHead className="w-[15%]">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                        </Table>
                        <div className="max-h-[500px] overflow-y-auto">
                            <Table>
                                <TableBody>
                                    {displayedData.length > 0 ? (
                                        displayedData.map((item) => (
                                            <TableRow
                                                key={`${item.id}-${item.code}`}
                                                onClick={() => onItemClick(item)}
                                                className="cursor-pointer"
                                            >
                                                <TableCell className="align-top font-medium">
                                                    #{item.code}
                                                </TableCell>
                                                <TableCell className="align-top">
                                                    {item.title}
                                                </TableCell>
                                                <TableCell className="align-top">
                                                    <div className="flex flex-col gap-2">
                                                        <span>{item.created_by}</span>
                                                        <Badge variant="secondary" className="w-fit font-normal">
                                                            {item.origin_office}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-2">
                                                        <Badge className="w-fit font-normal">
                                                            {formatBadgeText(item.status)}
                                                        </Badge>
                                                        <Badge variant="outline" className="w-fit font-normal">
                                                            {formatBadgeText(item.type)}
                                                        </Badge>
                                                        <Badge variant="secondary" className="w-fit font-normal">
                                                            {formatBadgeText(item.classification)}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="align-top whitespace-nowrap">
                                                    {format(parseISO(item.date_created), "MMM dd, yyyy")}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">
                                                <lottie-player
                                                    id="no result found"
                                                    ref={ref}
                                                    autoplay
                                                    controls={false}
                                                    loop
                                                    mode="normal"
                                                    src={"animation/1.json"}
                                                    className="w-1/2 mx-auto"
                                                    title="No Result Found"
                                                >
                                                </lottie-player>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
                {rowLimit !== "all" && filteredData.length > parseInt(rowLimit) && (
                    <div className="text-sm text-muted-foreground text-center mt-4">
                        Showing {displayedData.length} of {filteredData.length} documents
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default DataPreview;