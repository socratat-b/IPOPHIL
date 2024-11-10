// src/components/custom/document-types/control/add-document-type-button.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddDocumentTypeDialog } from "@/components/custom/document-types/control/add-document-type-dialog"; // Updated path
import { Icons } from "@/components/ui/icons";

interface AddDocumentTypeButtonProps {
    title?: string;
    onAdd?: () => void;
    actionType: "Create" | "Receive" | "Release";
    className?: string;
}

export const AddDocumentTypeButton: React.FC<AddDocumentTypeButtonProps> = ({
    title = "Add Document Type",
    onAdd,
    actionType,
    className = "h-8 px-2 lg:px-3",
}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpenDialog = () => {
        if (onAdd) onAdd();
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => setIsDialogOpen(false);

    const getIcon = () => {
        switch (actionType) {
            case "Create":
                return <Icons.add className="h-4 w-4" />;
            case "Receive":
                return <Icons.lucidePenLine className="h-4 w-4" />;
            case "Release":
                return <Icons.lucideSend className="h-4 w-4" />;
            default:
                return <Icons.add className="h-4 w-4" />;
        }
    };

    return (
        <>
            <Button
                onClick={handleOpenDialog}
                className={className}
            >
                {getIcon()}
                {title}
            </Button>
            {isDialogOpen && (
                <AddDocumentTypeDialog
                    onCloseAction={handleCloseDialog}
                    actionType={actionType}
                />
            )}
        </>
    );
};
