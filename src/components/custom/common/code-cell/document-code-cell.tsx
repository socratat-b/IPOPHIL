// src\components\custom\code-cell\document-code-cell.tsx
'use client'

import { useState } from 'react'
import { CodeType } from '@/lib/types'
import { CodeDisplay } from '@/components/custom/common/code-cell/code-display'
import { CodePreviewDialog } from '@/components/custom/common/code-cell/code-preview-dialog'

interface DocumentCodeCellProps {
    code: string
    type?: CodeType
}

export const DocumentCodeCell: React.FC<DocumentCodeCellProps> = ({ code, type }) => {
    const [selectedCodeType, setSelectedCodeType] = useState<CodeType | null>(null)
    const safeCode = code?.toString() || ''

    const handlePreviewClick = (selectedType: CodeType) => setSelectedCodeType(selectedType)

    return (
        <div className='inline-flex flex-wrap gap-4'>
            {/* Render QR Code if type is not specified or explicitly set to QR */}
            {(type === undefined || type === 'QR') && (
                <div
                    className='cursor-pointer hover:opacity-80 transition-opacity'
                    title={`View QR Code: ${safeCode}`}
                    onClick={() => handlePreviewClick('QR')}
                >
                    <CodeDisplay code={safeCode} type='QR' />
                </div>
            )}

            {/* Render Barcode if type is not specified or explicitly set to Barcode */}
            {(type === undefined || type === 'Barcode') && (
                <div
                    className='cursor-pointer hover:opacity-80 transition-opacity w-32 h-8 flex items-center'
                    title={`View Barcode: ${safeCode}`}
                    onClick={() => handlePreviewClick('Barcode')}
                >
                    <CodeDisplay code={safeCode} type='Barcode' />
                </div>
            )}

            {/* Preview Dialog */}
            <CodePreviewDialog
                code={safeCode}
                type={selectedCodeType}
                onClose={() => setSelectedCodeType(null)}
                isOpen={selectedCodeType !== null}
            />
        </div>
    )
}

export default DocumentCodeCell
