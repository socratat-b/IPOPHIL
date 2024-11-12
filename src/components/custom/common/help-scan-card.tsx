"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QrCodeIcon } from "lucide-react";
import { useState } from "react";

interface HelpScanCardProps {
    onCodeChange: (code: string) => void;
}

export const HelpScanCard: React.FC<HelpScanCardProps> = ({ onCodeChange }) => {
    const [previewData, setPreviewData] = useState<string>("Document Preview Panel");

    const handleScan = () => {
        // Mock scanning process or API call for scanning
        const scannedCode = "MockScannedCode123";
        onCodeChange(scannedCode); // Send scanned code back to parent
        setPreviewData(`Scanned Code: ${scannedCode}`);
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 p-6">
            {/* Scanning Instructions Card */}
            <Card className="flex-1 min-w-[300px] p-6 shadow-md rounded-lg">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-center text-gray-800">
                        Scanning Instructions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm mb-4 text-gray-600 text-center">
                        Follow these steps to scan the document’s QR or Barcode using a dedicated scanner.
                    </p>
                    <ol className="text-sm list-decimal list-inside space-y-2 text-gray-700">
                        <li>Click the scan button next to the input box on the right.</li>
                        <li>Place the document’s QR code or barcode under the scanner.</li>
                        <li>
                            Wait for the scanner to automatically detect and fill the code in
                            the input box. The preview of the document or document details
                            will be seen on the preview panel if the scanning is successful.
                        </li>
                        <li>If the scanner fails to detect the code, manually input the code into the input box.</li>
                    </ol>
                    <div className="flex justify-center mt-6">
                        <Image src="/images/scan.png" alt="Scan Icon" width={100} height={100} />
                    </div>
                </CardContent>
            </Card>

            {/* Document Code Input and Preview Panel */}
            <Card className="flex-1 min-w-[300px] p-6 shadow-md rounded-lg">
                <CardHeader className="flex items-center space-x-2">
                    <QrCodeIcon className="w-5 h-5 text-green-500" />
                    <CardTitle className="text-lg font-semibold text-gray-800">Document Preview Panel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <Input
                                id="code"
                                placeholder="Enter document code"
                                onChange={(e) => onCodeChange(e.target.value)}
                                className="flex-grow"
                            />
                            <Button variant="outline" onClick={handleScan} className="bg-green-500 text-white">
                                <QrCodeIcon className="w-4 h-4 mr-1" /> Scan
                            </Button>
                        </div>
                    </div>
                    <div className="h-40 border border-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                        {previewData}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
