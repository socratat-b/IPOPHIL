"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpScanCard } from "@/components/custom/common/help-scan-card";
import { z } from "zod";
import { useState } from "react";

// Schema
const createDocumentTypeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
});

const scanDocumentTypeSchema = z.object({
    code: z.string().min(1, "Code is required"),
    description: z.string().min(1, "Description is required"),
});

// Types
type CreateDocumentTypeData = z.infer<typeof createDocumentTypeSchema>;
type ScanDocumentTypeData = z.infer<typeof scanDocumentTypeSchema>;
type ActionType = "Receive" | "Release" | "Create";

interface AddDocumentTypeDialogProps {
    onCloseAction: () => void;
    actionType: ActionType;
}

const CreateDocumentTypeForm = ({ onSubmit, onClose }: {
    onSubmit: (data: CreateDocumentTypeData) => void;
    onClose: () => void;
}) => {
    const { register, handleSubmit, formState: { errors } } = useForm<CreateDocumentTypeData>({
        resolver: zodResolver(createDocumentTypeSchema),
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
                <label htmlFor="name" className="block mb-1">Type Name *</label>
                <Input
                    id="name"
                    placeholder="Enter document type name"
                    {...register("name")}
                    className="w-full"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div className="col-span-2">
                <label htmlFor="description" className="block mb-1">Description *</label>
                <Input
                    id="description"
                    placeholder="Enter description"
                    {...register("description")}
                    className="w-full"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            <Card className="col-span-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        <p className="text-sm text-gray-500">
                            Note, the following will be automatically generated:
                        </p>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="text-sm text-gray-500 list-disc list-inside">
                        <li>Type Code</li>
                        <li>Created By</li>
                        <li>Date Created</li>
                    </ul>
                </CardContent>
            </Card>

            <div className="col-span-2 flex justify-end space-x-2">
                <Button type="submit" variant={"default"}>Create</Button>
                <DialogClose asChild>
                    <Button variant={"secondary"} onClick={onClose}>
                        Cancel
                    </Button>
                </DialogClose>
            </div>
        </form>
    );
};

const ScanDocumentTypeForm = ({ onSubmit, onClose, actionType }: {
    onSubmit: (data: ScanDocumentTypeData) => void;
    onClose: () => void;
    actionType: ActionType;
}) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ScanDocumentTypeData>({
        resolver: zodResolver(scanDocumentTypeSchema),
    });

    const [scannedCode, setScannedCode] = useState<string>("");

    const handleCodeChange = (code: string) => {
        setScannedCode(code);
        setValue("code", code);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
                <label htmlFor="code" className="block mb-1">Type Code</label>
                <Input
                    id="code"
                    placeholder="Scan or manually enter type code"
                    value={scannedCode}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    className="w-full"
                />
                {errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}
            </div>
            <div className="col-span-2">
                <HelpScanCard onCodeChange={handleCodeChange} actionType={actionType} mockDocuments={[]} />
            </div>

            <div className="col-span-2 flex justify-end space-x-2">
                <Button type="submit" variant={"default"}>Proceed</Button>
                <DialogClose asChild>
                    <Button variant={"secondary"} onClick={onClose}>
                        Cancel
                    </Button>
                </DialogClose>
            </div>
        </form>
    );
};

export const AddDocumentTypeDialog: React.FC<AddDocumentTypeDialogProps> = ({ onCloseAction, actionType }) => {
    const handleCreateSubmit = (data: CreateDocumentTypeData) => {
        toast.success("Document Type Created", {
            description: "Your document type has been successfully created.",
            action: { label: "Undo", onClick: () => console.log("Undo") },
        });
        onCloseAction();
    };

    const handleScanSubmit = (data: ScanDocumentTypeData) => {
        toast.success(`Document Type ${actionType}d`, {
            description: `Your document type has been successfully ${actionType.toLowerCase()}d.`,
        });
        onCloseAction();
    };

    return (
        <Dialog open onOpenChange={(isOpen) => !isOpen && onCloseAction()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{`${actionType} Document Type`}</DialogTitle>
                </DialogHeader>

                {actionType === "Create" ? (
                    <CreateDocumentTypeForm onSubmit={handleCreateSubmit} onClose={onCloseAction} />
                ) : (
                    <ScanDocumentTypeForm
                        onSubmit={handleScanSubmit}
                        onClose={onCloseAction}
                        actionType={actionType}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};
