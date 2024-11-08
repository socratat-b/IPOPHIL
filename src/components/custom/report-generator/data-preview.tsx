import { format, parseISO } from "date-fns"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataPreviewProps } from "@/lib/types";
import { formatBadgeText } from "@/lib/controls/helper";

export const DataPreview: React.FC<DataPreviewProps> = ({
    filteredData,
    filters,
    onItemClick,
}) => {
    return (
        <Card className="border-none shadow-none">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">Document Report</CardTitle>
                        <CardDescription>
                            Total Documents: {filteredData.length}
                        </CardDescription>
                    </div>
                </div>

                {/* Active Filters Summary */}
                {(filters.office || filters.classification || filters.type || (filters.date?.from && filters.date?.to)) && (
                    <div className="text-sm text-muted-foreground mt-2">
                        Filters: {' '}
                        {[
                            filters.office && `Office: ${filters.office}`,
                            filters.classification && `Class: ${filters.classification}`,
                            filters.type && `Type: ${filters.type}`,
                            (filters.date?.from && filters.date?.to) &&
                            `Date: ${filters.date.from instanceof Date && filters.date.to instanceof Date
                                ? `${format(filters.date.from, "MMM dd")} - ${format(filters.date.to, "MMM dd, yyyy")}`
                                : ''}`
                        ].filter(Boolean).join(" | ")}
                    </div>
                )}
            </CardHeader>

            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-2 whitespace-nowrap">Code</th>
                                <th className="text-left p-2">Title</th>
                                <th className="text-left p-2">Created By</th>
                                <th className="text-left p-2 whitespace-nowrap">Metadata</th>
                                <th className="text-left p-2 whitespace-nowrap">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                    <tr
                                        key={`${item.id}-${item.code}`}
                                        className="border-b hover:bg-muted/50 cursor-pointer"
                                        onClick={() => onItemClick(item)}
                                    >
                                        <td className="p-2 align-top whitespace-nowrap">#{item.code}</td>
                                        <td className="p-2 align-top min-w-[200px]">{item.title}</td>
                                        <td className="p-2 align-top">
                                            <div className="flex flex-col space-y-2">
                                                {item.created_by}
                                                <Badge variant={"secondary"} className="w-fit font-normal">
                                                    {item.origin_office}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="p-2">
                                            <div className="flex flex-col space-y-2">
                                                <Badge className="w-fit font-normal">
                                                    {formatBadgeText(item.status)}
                                                </Badge>
                                                <Badge variant={"outline"} className="w-fit font-normal">
                                                    {formatBadgeText(item.type)}
                                                </Badge>
                                                <Badge variant={"secondary"} className="w-fit font-normal">
                                                    {formatBadgeText(item.classification)}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="p-2 align-top whitespace-nowrap">
                                            {format(parseISO(item.date_created), "MMM dd, yyyy")}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center p-8 text-muted-foreground">
                                        No documents found matching the filters
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

export default DataPreview;
