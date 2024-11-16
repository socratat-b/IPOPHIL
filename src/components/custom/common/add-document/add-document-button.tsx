// src\components\custom\common\add-document\add-document-button.tsx
import { useState } from 'react'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { AddDocumentDialog } from '@/components/custom/common/add-document/add-document-dialog'

interface AddDocumentButtonProps {
    title?: string
    onAdd?: () => void
    actionType: 'Create' | 'Receive' | 'Release'
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    className?: string
}

export const AddDocumentButton: React.FC<AddDocumentButtonProps> = ({
    title = 'Add',
    onAdd,
    actionType,
    variant = 'default',
    className = 'h-8 px-2 lg:px-3'
}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleOpenDialog = () => {
        if (onAdd) onAdd()
        setIsDialogOpen(true)
    }
    const handleCloseDialog = () => setIsDialogOpen(false)

    const getIcon = () => {
        switch (actionType) {
            case 'Create':
                return <Icons.add className='h-4 w-4' />
            case 'Receive':
                return <Icons.lucidePenLine className='h-4 w-4' />
            case 'Release':
                return <Icons.lucideSend className='h-4 w-4' />
            default:
                return <Icons.add className='h-4 w-4' />
        }
    }

    return (
        <>
            <Button
                variant={variant}
                onClick={handleOpenDialog}
                className={className}
            >
                {getIcon()}
                {title}
            </Button>
            {isDialogOpen && (
                <AddDocumentDialog
                    onCloseAction={handleCloseDialog}
                    actionType={actionType}
                />
            )}
        </>
    )
}