import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TableSkeletonProps {
    columns?: number;
    rows?: number;
}

export default function TableSkeleton({ columns = 4, rows = 5 }: TableSkeletonProps) {
    return (
        <div className="space-y-4 p-4">
            {/* Toolbar placeholder */}
            <div className="mb-4">
                <Skeleton className="h-8 w-1/3" />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {Array.from({ length: columns }).map((_, index) => (
                                <TableHead key={index}>
                                    <Skeleton className="h-6 w-24" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {Array.from({ length: columns }).map((_, colIndex) => (
                                    <TableCell key={colIndex}>
                                        <Skeleton className="h-6 w-full" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination placeholder */}
            <div className="mt-4 flex justify-between items-center">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-24" />
            </div>
        </div>
    );
}
