"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import Barcode from "react-barcode";
import { CodeConfig, CodeDisplayProps } from "@/lib/types";
import { CODE_CONFIG } from "@/lib/controls/code";

export const CodeDisplay: React.FC<CodeDisplayProps> = ({
    code,
    type,
    size,
    showValue = false
}) => {
    const config = CODE_CONFIG.cell[type];

    if (type === 'QR') {
        const qrConfig = config as CodeConfig['QR'];
        const displaySize = size?.width || qrConfig.size;

        return (
            <QRCodeSVG
                value={code}
                size={displaySize}
                level={qrConfig.level}
                marginSize={qrConfig.marginSize}
            />
        );
    }

    const barcodeConfig = config as CodeConfig['Barcode'];
    const displayConfig = size ? {
        width: size.width || barcodeConfig.width,
        height: size.height || barcodeConfig.height,
    } : barcodeConfig;

    return (
        <Barcode
            value={code}
            width={displayConfig.width}
            height={displayConfig.height}
            fontSize={barcodeConfig.fontSize}
            margin={barcodeConfig.margin}
            displayValue={showValue}
        />
    );
};