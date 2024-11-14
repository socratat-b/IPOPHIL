import { format } from 'date-fns'
import { toast } from 'sonner'
import { Table } from '@tanstack/react-table'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { documentsSchema } from '@/lib/faker/documents/schema'

export type FileType = 'pdf' | 'excel' | 'csv'
export type PdfOrientation = 'portrait' | 'landscape'

// Define a more specific type for the data records
export type DocumentRecord = {
    [key: string]: string | number | boolean | Date | null | undefined
}

interface PdfGenerationOptions {
    orientation?: PdfOrientation
    title?: string
    filename?: string
    columns?: ColumnDefinition[]
}

interface ColumnDefinition {
    id: string
    header: string
}

// Updated column widths for compact design
const COMPACT_COLUMN_WIDTH = 15
const getColumnWidth = (columnId: string) => {
    if (['title', 'remarks'].includes(columnId)) return 30
    if (columnId.includes('date_')) return 18
    return COMPACT_COLUMN_WIDTH
}

export const formatColumnHeader = (header: string): string => {
    return header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ')
}

const DEFAULT_COLUMNS: ColumnDefinition[] = Object.keys(documentsSchema.shape).map(key => ({
    id: key,
    header: formatColumnHeader(key)
}))

const formatDateValue = (value: unknown): string => {
    if (!value) return ''
    try {
        return format(new Date(String(value)), 'MM/dd/yyyy')
    } catch {
        return String(value || '')
    }
}

const formatCellValue = (value: unknown, columnId: string): string => {
    if (value === null || value === undefined) return ''
    if (columnId.includes('date_')) {
        return formatDateValue(value)
    }
    return String(value)
}

export function formatTableData<TData>(table: Table<TData>): Record<string, string>[] {
    return table.getFilteredRowModel().rows.map((row) => {
        const formattedRow: Record<string, string> = {}
        table.getAllLeafColumns()
            .filter(column => !['select', 'actions'].includes(column.id))
            .forEach(column => {
                const value = row.getValue(column.id)
                formattedRow[formatColumnHeader(column.id)] = formatCellValue(value, column.id)
            })
        return formattedRow
    })
}

export const downloadFile = async (
    data: unknown,
    fileType: 'excel' | 'csv',
    prefix: string = 'Export'
): Promise<boolean> => {
    const extension = fileType === 'excel' ? 'xlsx' : 'csv'
    const filename = `${prefix}-${format(new Date(), 'yyyy-MM-dd')}`

    try {
        const response = await fetch(`/api/reports/${fileType}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data, filename }),
        })

        if (!response.ok) throw new Error(`${fileType.toUpperCase()} generation failed`)

        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${filename}.${extension}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        toast.success('Success', {
            description: `Documents have been successfully exported to ${fileType.toUpperCase()}.`
        })

        return true
    } catch (error) {
        console.error('Export error:', error)
        toast.error('Error', {
            description: `Failed to export documents to ${fileType.toUpperCase()}.`
        })
        return false
    }
}

export const generatePDF = <T extends DocumentRecord>(
    data: T[],
    options: PdfGenerationOptions = {}
): void => {
    try {
        const {
            orientation = 'landscape',
            title = 'Document Export',
            filename = `IPOPHIL-REPORT-${format(new Date(), 'yyyy-MM-dd')}`,
            columns = DEFAULT_COLUMNS
        } = options

        // Set page dimensions based on orientation
        const isLandscape = orientation === 'landscape'
        const pageWidth = isLandscape ? 297 : 210
        const pageHeight = isLandscape ? 210 : 297

        const doc = new jsPDF({
            orientation,
            unit: 'mm',
            format: 'a4'
        })

        const headers = columns.map(col => col.header)
        const rows = data.map(item =>
            columns.map(col => formatCellValue(item[col.id], col.id))
        )

        // Calculate total content width based on adjusted column widths
        const totalContentWidth = columns.reduce((sum, col) => sum + getColumnWidth(col.id), 0)

        // Ensure minimum margin and center the table
        const horizontalMargin = Math.max((pageWidth - totalContentWidth) / 2, 10)

        const margins = {
            left: horizontalMargin,
            right: horizontalMargin,
            top: 15,
            bottom: 10
        }

        autoTable(doc, {
            head: [headers],
            body: rows,
            styles: {
                fontSize: 6,
                cellPadding: 1,
                overflow: 'linebreak',
                lineWidth: 0.1,
                minCellHeight: 4,
                halign: 'left',
                valign: 'middle',
                lineColor: [200, 200, 200],
            },
            headStyles: {
                fillColor: [220, 220, 220],
                textColor: [0, 0, 0],
                fontSize: 6.5,
                fontStyle: 'bold',
                halign: 'center',
                minCellHeight: 6,
                cellPadding: 1,
            },
            columnStyles: Object.fromEntries(
                columns.map((col, index) => [
                    index,
                    {
                        cellWidth: getColumnWidth(col.id),
                        halign: col.id.includes('date_') ? 'center' : 'left',
                        overflow: 'linebreak',
                        maxHeight: 30,
                    }
                ])
            ),
            startY: margins.top + 5,
            tableWidth: totalContentWidth,
            margin: margins,
            didDrawPage: (data) => {
                // Title
                doc.setFontSize(9)
                doc.setFont('helvetica', 'bold')
                const titleWidth = doc.getTextWidth(title)
                doc.text(title, (pageWidth - titleWidth) / 2, 10)

                // Page numbers
                doc.setFontSize(7)
                doc.setFont('helvetica', 'normal')
                doc.text(
                    `Page ${data.pageNumber} of ${doc.getNumberOfPages()}`,
                    pageWidth - margins.right,
                    pageHeight - (margins.bottom / 2),
                    { align: 'right' }
                )
            },
        })

        doc.save(`${filename}.pdf`)
        toast.success('Success', {
            description: `PDF '${filename}.pdf' was automatically saved.`
        })
    } catch (error) {
        console.error('Error generating PDF:', error)
        toast.error('Error', {
            description: 'Failed to generate the PDF for download. Please try again.'
        })
    }
}