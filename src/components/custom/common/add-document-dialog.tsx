'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createDocumentSchema } from '@/lib/validations/documents/create_documents'
import { scanDocumentSchema } from '@/lib/validations/documents/scan_documents'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HelpScanCard } from '@/components/custom/common/help-scan-card'
import { z } from 'zod'
import { useDocuments } from '@/lib/services/documents'
import { useDocumentTypes } from '@/lib/services/document-types'
import { doc_classification } from '@/lib/dms/data'

// Types
type CreateDocumentData = z.infer<typeof createDocumentSchema>
type ScanDocumentData = z.infer<typeof scanDocumentSchema>
type ActionType = 'Receive' | 'Release' | 'Create'

interface AddDocumentDialogProps {
    onCloseAction: () => void
    actionType: ActionType
}

// Form for Creating a Document
const CreateDocumentForm = ({ onSubmit, onClose }: {
    onSubmit: (data: CreateDocumentData) => void
    onClose: () => void
}) => {
    const form = useForm<CreateDocumentData>({
        resolver: zodResolver(createDocumentSchema),
    })

    const { documentTypes } = useDocumentTypes()

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col space-y-4'>
            <div>
                <label htmlFor='title' className='block mb-1'>Subject/Title *</label>
                <Input
                    id='title'
                    placeholder='Enter document title'
                    {...form.register('title')}
                    className='w-full'
                />
                {form.formState.errors.title && (
                    <p className='text-red-500 text-sm'>{form.formState.errors.title.message}</p>
                )}
            </div>

            <div>
                <label htmlFor='classification' className='block mb-1'>Classification *</label>
                <Controller
                    name="classification"
                    control={form.control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Select a classification' />
                            </SelectTrigger>
                            <SelectContent>
                                {doc_classification.map((classification) => (
                                    <SelectItem key={classification.value} value={classification.value}>
                                        {classification.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {form.formState.errors.classification && (
                    <p className='text-red-500 text-sm'>{form.formState.errors.classification.message}</p>
                )}
            </div>

            <div>
                <label htmlFor='type' className='block mb-1'>Type *</label>
                <Controller
                    name="type"
                    control={form.control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Select a type' />
                            </SelectTrigger>
                            <SelectContent>
                                {documentTypes?.map((type) => (
                                    <SelectItem key={type.type_id} value={type.type_id}>
                                        {type.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {form.formState.errors.type && (
                    <p className='text-red-500 text-sm'>{form.formState.errors.type.message}</p>
                )}
            </div>

            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                        <p className='text-sm text-gray-500'>
                            Note, the following will be automatically generated:
                        </p>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className='text-sm text-gray-500 list-disc list-inside'>
                        <li>Document Code</li>
                        <li>Origin Office</li>
                        <li>Created By</li>
                        <li>Date Created</li>
                        <li>Empty Logbook</li>
                    </ul>
                </CardContent>
            </Card>

            <div className='flex justify-end space-x-2'>
                <Button type='submit' variant={'default'}>Create</Button>
                <DialogClose asChild>
                    <Button variant={'secondary'} onClick={onClose}>
                        Cancel
                    </Button>
                </DialogClose>
            </div>
        </form>
    )
}

// Form for Scanning a Document
const ScanDocumentForm = ({ onSubmit, onClose, actionType }: {
    onSubmit: (data: ScanDocumentData) => void
    onClose: () => void
    actionType: ActionType
}) => {
    const { handleSubmit, setValue } = useForm<ScanDocumentData>({
        resolver: zodResolver(scanDocumentSchema),
    })

    const handleCodeChange = (code: string) => {
        setValue('code', code)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-4'>
            <HelpScanCard onCodeChange={handleCodeChange} actionType={actionType} />
            {/* mockDocuments={[]} */}

            <div className='flex justify-end space-x-2'>
                <Button
                    type='submit'
                    variant='default'
                    onClick={() => {
                        toast.success(`Document ${actionType}`, {
                            description: `Your document has been successfully ${actionType.toLowerCase()}d.`,
                        })
                        onClose() // Close the dialog after showing success
                    }}
                >
                    Proceed
                </Button>
                <DialogClose asChild>
                    <Button variant='secondary' onClick={onClose}>
                        Cancel
                    </Button>
                </DialogClose>
            </div>
        </form>
    )
}

// Main Dialog Component
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
        // Display a message on code entry the final success is handled by Proceed button
        toast.info(`Document ${actionType}`, {
            description: `Document details have been populated. Review the information before proceeding.`,
        })
    }

    return (
        <Dialog open onOpenChange={(isOpen) => !isOpen && onCloseAction()}>
            <DialogContent className='w-full max-w-3xl bg-white rounded-lg shadow-lg' aria-describedby='dialog-description'>
                <DialogHeader>
                    <DialogTitle>{`${actionType} Document`}</DialogTitle>
                </DialogHeader>
                <div id='dialog-description' className='sr-only'>
                    {actionType} a document by entering details or scanning the QR code.
                </div>

                {actionType === 'Create' ? (
                    <CreateDocumentForm onSubmit={handleCreateSubmit} onClose={onCloseAction} />
                ) : (
                    <ScanDocumentForm onSubmit={handleScanSubmit} onClose={onCloseAction} actionType={actionType} />
                )}
            </DialogContent>
        </Dialog>
    )
}
