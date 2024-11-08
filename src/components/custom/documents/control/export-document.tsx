"use client"

import { useState, useRef } from "react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    FileType,
    formatColumnHeader,
    downloadFile,
    generatePDF
} from "@/lib/controls";
import { FileDownIcon } from "lucide-react";

interface ExportDialogProps<TData> {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    table: Table<TData>;
}

interface ExportAllDocumentProps<TData> {
    table: Table<TData>;
}

// Define a type for row data
type RowData = {
    [key: string]: string | number | boolean | null | undefined;
};

const EXCLUDED_COLUMNS = ['select', 'print-code', 'actions'];

const ExportDialog = <TData,>({ open, onOpenChange, table }: ExportDialogProps<TData>) => {
    const [fileType, setFileType] = useState<FileType>('pdf');
    const [isExporting, setIsExporting] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    const visibleColumns = table.getVisibleFlatColumns()
        .filter(column => !EXCLUDED_COLUMNS.includes(column.id));
    const dataToExport = table.getFilteredRowModel().rows;

    const formatExportData = (rows: typeof dataToExport) => {
        return rows.map(row => {
            const rowData: RowData = {};
            visibleColumns.forEach(column => {
                rowData[column.id] = row.getValue(column.id);
            });
            return rowData;
        });
    };

    const handleExport = async () => {
        const formattedData = formatExportData(dataToExport);

        if (fileType === 'pdf') {
            generatePDF(formattedData, {
                orientation: 'portrait',
                title: 'IPOPHIL Document Report',
                columns: visibleColumns.map(column => ({
                    id: column.id,
                    header: formatColumnHeader(column.id)
                }))
            });
            return;
        }

        setIsExporting(true);
        const success = await downloadFile(formattedData, fileType, 'Report');
        if (success) onOpenChange(false);
        setIsExporting(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Export Documents</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="grid gap-1">
                                <Label>Total Documents</Label>
                                <p className="text-sm text-muted-foreground">
                                    {dataToExport.length} document(s) will be exported
                                </p>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>File Type</Label>
                                <Select
                                    value={fileType}
                                    onValueChange={(value) => setFileType(value as FileType)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pdf">PDF Document</SelectItem>
                                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                                        <SelectItem value="csv">CSV File</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                className="w-full"
                                onClick={handleExport}
                                disabled={isExporting}
                            >
                                {isExporting ? 'Exporting...' : 'Export Documents'}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Hidden content for PDF generation */}
                    <div className="hidden">
                        <div ref={printRef} className="p-6">
                            <h1 className="text-2xl font-bold mb-4">Document Export</h1>
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        {visibleColumns.map((column) => (
                                            <th key={column.id} className="border p-2 text-left">
                                                {formatColumnHeader(column.id)}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataToExport.map((row) => (
                                        <tr key={row.id}>
                                            {visibleColumns.map((column) => (
                                                <td key={column.id} className="border p-2">
                                                    {String(row.getValue(column.id) || '')}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export function ExportAllDocument<TData>({ table }: ExportAllDocumentProps<TData>) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                variant={"outline"}
                onClick={() => setOpen(true)}
                className="h-8 px-2 lg:px-3"
            >
                <FileDownIcon className="h-4 w-4 mr-2" />
                Export
            </Button>
            <ExportDialog
                open={open}
                onOpenChange={setOpen}
                table={table}
            />
        </>
    );
}