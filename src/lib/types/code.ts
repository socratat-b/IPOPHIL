// src\lib\types\code.ts
export type CodeType = 'QR' | 'Barcode';

export interface CodeConfig {
    QR: {
        size: number;
        level: "Q";
        marginSize: number;
    };
    Barcode: {
        width: number;
        height: number;
        fontSize: number;
        margin: number;
    };
}

export interface CodeDisplayProps {
    code: string;
    type: CodeType;
    size?: {
        width?: number;
        height?: number;
    };
    showValue?: boolean;
}

export interface CodePreviewDialogProps {
    code: string;
    type: CodeType | null;
    isOpen: boolean;
    onClose: () => void;
}