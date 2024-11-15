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
import { QrCode } from 'lucide-react'
import { z } from 'zod'
import { useDocuments } from '@/lib/services/documents'
import { useDocumentTypes } from '@/lib/services/document-types'
import { doc_classification } from '@/lib/dms/data'
import Image from 'next/image'
import { useState } from 'react'

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
    const { documents = [] } = useDocuments()
    const [documentCode, setDocumentCode] = useState('')
    const [documentDetails, setDocumentDetails] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const { handleSubmit, setValue } = useForm<ScanDocumentData>({
        resolver: zodResolver(scanDocumentSchema),
    })

    const handleScan = async () => {
        setIsLoading(true)
        setValue('code', documentCode)

        try {
            // Find document in existing documents
            const foundDoc = documents.find(doc => doc.code === documentCode)
            if (foundDoc) {
                setDocumentDetails(foundDoc)
                toast.success('Document found')
            } else {
                setDocumentDetails(null)
                toast.error('Document not found')
            }
        } catch (error) {
            toast.error('Error scanning document')
            setDocumentDetails(null)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='grid grid-cols-2 gap-6 p-4'>
            {/* Left Side - Scanning Instructions */}
            <Card>
                <CardHeader>
                    <CardTitle>Scanning Instructions</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <p className='text-sm text-muted-foreground'>
                        Follow these steps to scan the document's QR or Barcode using a dedicated scanner.
                    </p>
                    <ol className='text-sm list-decimal list-inside space-y-2'>
                        <li>Click the scan button next to the input box on the right.</li>
                        <li>Place the document's QR code or barcode under the scanner.</li>
                        <li>Wait for the scanner to automatically detect and fill the code in the input box. The preview
                            of the document or document details will be seen on the preview panel if the scanning is
                            successful.</li>
                        <li>If the scanner fails to detect the code, manually input the code into the input box.</li>
                    </ol>
                    <div className='flex justify-center mt-6'>
                        <Image 
                            src="/images/scan.png" 
                            alt="Scanner" 
                            width={150} 
                            height={150}
                            className='opacity-50'
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Right Side - Document Preview Panel */}
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <QrCode className='w-5 h-5' />
                        Document Preview Panel
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className='flex gap-2'>
                        <Input
                            value={documentCode}
                            onChange={(e) => setDocumentCode(e.target.value)}
                            placeholder="Enter document code"
                            className='flex-1'
                        />
                        <Button 
                            onClick={handleScan} 
                            disabled={isLoading}
                            variant='default'
                        >
                            {isLoading ? "Scanning..." : "Scan"}
                        </Button>
                    </div>

                    {documentDetails && (
                        <div className='space-y-4'>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='text-sm font-medium'>Origin Office</label>
                                    <Input value={documentDetails.origin_office} readOnly className='mt-1' />
                                </div>
                                <div>
                                    <label className='text-sm font-medium'>Subject/Title</label>
                                    <Input value={documentDetails.title} readOnly className='mt-1' />
                                </div>
                                <div>
                                    <label className='text-sm font-medium'>Classification</label>
                                    <Input value={documentDetails.classification} readOnly className='mt-1' />
                                </div>
                                <div>
                                    <label className='text-sm font-medium'>Type</label>
                                    <Input value={documentDetails.type} readOnly className='mt-1' />
                                </div>
                                <div>
                                    <label className='text-sm font-medium'>Created By</label>
                                    <Input value={documentDetails.created_by} readOnly className='mt-1' />
                                </div>
                                <div>
                                    <label className='text-sm font-medium'>Date Created</label>
                                    <Input 
                                        value={new Date(documentDetails.date_created).toLocaleDateString()} 
                                        readOnly 
                                        className='mt-1' 
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Bottom Action Buttons */}
            <div className='col-span-2 flex justify-end space-x-2'>
                {documentDetails && (
                    <Button
                        onClick={() => {
                            onSubmit({ code: documentCode })
                            toast.success(`Document ${actionType}d`, {
                                description: `Document has been successfully ${actionType.toLowerCase()}d.`
                            })
                            onClose()
                        }}
                        variant='default'
                    >
                        Proceed
                    </Button>
                )}
                <Button variant='secondary' onClick={onClose}>
                    Cancel
                </Button>
            </div>
        </div>
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