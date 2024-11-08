import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const HelpScanCard: React.FC = () => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    How to Scan QR Code
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ol className="text-sm list-decimal list-inside">
                    <li>Select the input field.</li>
                    <li>Use scanner to scan the document.</li>
                    <li>
                        Wait for the scanner to automatically detect and fill the code in the
                        input box.
                    </li>
                    <li>
                        The preview of the document or document details will be
                        seen on the preview panel if the scanning is successful.
                    </li>
                    <li>
                        If the scanner fails to detect the code, manually input the code into
                        the input box.
                    </li>
                    <li>If scanning fails, manually type the code into the input box.</li>
                </ol>
            </CardContent>
        </Card>
    );
};
