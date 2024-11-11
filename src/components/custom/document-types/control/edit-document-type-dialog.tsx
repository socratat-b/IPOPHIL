// src/components/custom/document-types/control/edit-document-type-dialog.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DocumentType, documentTypesSchema } from "@/lib/dms/schema";

interface EditDocumentTypeDialogProps {
    documentType: DocumentType | null;
    onClose: () => void;
    onSubmit: (data: DocumentType) => void;
}

export function EditDocumentTypeDialog({
    documentType,
    onClose,
    onSubmit,
}: EditDocumentTypeDialogProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<DocumentType>({
        resolver: zodResolver(documentTypesSchema),
        defaultValues: documentType || {},
    });

    const handleFormSubmit = (data: DocumentType) => {
        onSubmit(data);
        onClose();
    };

    return (
        <Dialog open={!!documentType} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Document Type</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block mb-1">Type Name</label>
                        <Input
                            id="name"
                            placeholder="Enter document type name"
                            {...register("name")}
                            className="w-full"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="description" className="block mb-1">Description</label>
                        <textarea
                            id="description"
                            placeholder="Enter description"
                            {...register("description")}
                            className="w-full p-2 border rounded-md resize-y overflow-auto"
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button type="submit" variant="default">Save</Button>
                        <DialogClose asChild>
                            <Button variant="secondary" onClick={onClose}>
                                Cancel
                            </Button>
                        </DialogClose>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
