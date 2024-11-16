// src\components\custom\common\add-document\add-document-dialog.tsx
import { toast } from 'sonner'
import { ActionType } from '@/lib/types'
import { useDocuments } from '@/lib/services/documents'
import { ScanDocumentForm } from './scan-document-form'
import { CreateDocumentForm } from './create-document-form'
import { ScanDocumentData } from '@/lib/validations/documents/scan_documents'
import { CreateDocumentData } from '@/lib/validations/documents/create_documents'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface AddDocumentDialogProps {
    onCloseAction: () => void
    actionType: ActionType
}

export const AddDocumentDialog: React.FC<AddDocumentDialogProps> = ({ onCloseAction, actionType }) => {
    const { createDocument } = useDocuments()

    const handleCreateSubmit = async (data: CreateDocumentData) => {
        toast.success('Document Created', {
            description: 'Your document has been successfully added.',
        })
        onCloseAction()
        // try {
        //     await createDocument(data)
        //     toast.success('Document Created', {
        //         description: 'Your document has been successfully added.',
        //     })
        //     onCloseAction()
        // } catch (error) {
        //     toast.error('Failed to create document')
        // }
    }

    const handleScanSubmit = (data: ScanDocumentData) => {
        if (!data.code) {
            toast.error('Error', {
                description: 'Please scan or enter a valid document code.',
            })
            return
        }
        toast.info(`Document ${actionType}`, {
            description: `Document details have been populated. Review the information before proceeding.`,
        })
    }

    return (
        <Dialog open onOpenChange={(isOpen) => !isOpen && onCloseAction()}>
            <DialogContent className='w-full max-w-4xl bg-white rounded-lg shadow-lg'>
                <DialogHeader>
                    <DialogTitle>{actionType} Document</DialogTitle>
                </DialogHeader>

                {actionType === 'Create' ? (
                    <CreateDocumentForm onSubmit={handleCreateSubmit} onClose={onCloseAction} />
                ) : (
                    <ScanDocumentForm onSubmit={handleScanSubmit} onClose={onCloseAction} actionType={actionType} />
                )}
            </DialogContent>
        </Dialog>
    )
}

export default AddDocumentDialog