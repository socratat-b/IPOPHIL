import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CodePreviewDialogProps } from "@/lib/types";
import { CodeDisplay } from "./code-display";
import { Icons } from "@/components/ui/icons";

export const CodePreviewDialog: React.FC<CodePreviewDialogProps> = ({
    code,
    type,
    isOpen,
    onClose
}) => {
    if (!code || !type) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader className="text-center print-hidden">
                    <DialogTitle>{type} Code Preview</DialogTitle>
                </DialogHeader>

                {/* Print Container */}
                <div className="print-container">
                    {type === 'QR' ? (
                        <div className="qr-code flex items-center justify-center">
                            <CodeDisplay
                                code={code}
                                type={type}
                                size={{ width: 400 }}
                            />
                        </div>
                    ) : (
                        <div className="barcode-container flex items-center justify-center">
                            <CodeDisplay
                                code={code}
                                type={type}
                                showValue={true}
                                size={{ width: 3, height: 200 }}
                            />
                        </div>
                    )}
                </div>

                {/* Preview Only Container */}
                <div className="flex items-center justify-center gap-4 mt-8 print-hidden">
                    <Button
                        onClick={handlePrint}
                        className="flex items-center gap-2"
                    >
                        <Icons.printer className="w-4 h-4" />
                        <span>Print</span>
                    </Button>

                    <DialogClose asChild>
                        <Button
                            onClick={onClose}
                            variant={"outline"}
                        >
                            Close
                        </Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CodePreviewDialog;