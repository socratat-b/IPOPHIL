import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { DialogClose } from '@/components/ui/dialog'
import { HelpScanCard } from '@/components/custom/common/help-scan-card'

interface Document {
    code: string
    origin_office: string
    title: string
    classification: string
    type: string
    created_by: string
    date_created: string
    status: string
    remarks: string
}

interface ScanDocumentFormProps {
    onSubmit: (data: any) => void
    onClose: () => void
    actionType: 'Receive' | 'Release'
    mockDocuments: Document[]
}

const ScanDocumentForm = ({ onSubmit, onClose, actionType, mockDocuments }: ScanDocumentFormProps) => {
    const { handleSubmit } = useForm()

    const handleCodeChange = (code: string) => {
        // Handle code change logic if needed
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-4'>
            <HelpScanCard onCodeChange={handleCodeChange} actionType={actionType} />
            {/* mockDocuments={mockDocuments}  */}

            <div className='flex justify-end space-x-2'>
                <Button type='submit' variant={'default'}>Proceed</Button>
                <DialogClose asChild>
                    <Button variant={'secondary'} onClick={onClose}>
                        Cancel
                    </Button>
                </DialogClose>
            </div>
        </form>
    )
}

export default ScanDocumentForm
