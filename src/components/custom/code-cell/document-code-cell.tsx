// src\components\custom\documents\control\document-code-cell.tsx
'use client'

import React from "react";
import { CodePreviewDialog } from "./code-preview-dialog";
import { CodeDisplay } from "./code-display";
import { CodeType } from "@/lib/types";

export const DocumentCodeCell: React.FC<{ code: string }> = ({ code }) => {
    const [selectedCodeType, setSelectedCodeType] = React.useState<CodeType | null>(null);
    const safeCode = code?.toString() || '';

    const handlePreviewClick = (type: CodeType) => setSelectedCodeType(type);

    return (
        <div className="inline-flex space-x-2">
            {/* QR Code */}
            <div
                className="cursor-pointer hover:opacity-80 transition-opacity"
                title={`View QR Code: ${safeCode}`}
                onClick={() => handlePreviewClick('QR')}
            >
                <CodeDisplay code={safeCode} type="QR" />
            </div>

            {/* Barcode */}
            <div
                className="cursor-pointer hover:opacity-80 transition-opacity w-24 h-6 flex items-center"
                title={`View Barcode: ${safeCode}`}
                onClick={() => handlePreviewClick('Barcode')}
            >
                <CodeDisplay code={safeCode} type="Barcode" />
            </div>

            {/* Preview Dialog */}
            <CodePreviewDialog
                code={safeCode}
                type={selectedCodeType}
                onClose={() => setSelectedCodeType(null)}
                isOpen={selectedCodeType !== null}
            />
        </div>
    );
};

export default DocumentCodeCell;