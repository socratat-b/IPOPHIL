// src\components\custom\common\add-document\scan-document-form.tsx
import Image from 'next/image'

import { toast } from 'sonner'
import { useState } from 'react'
import { QrCode } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDocuments } from '@/lib/services/documents'
import { ScanDocumentData, scanDocumentSchema } from '@/lib/validations/documents/scan_documents'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ActionType } from '@/lib/types'

interface ScanDocumentFormProps {
    onSubmit: (data: ScanDocumentData) => void
    onClose: () => void
    actionType: ActionType
}

export const ScanDocumentForm: React.FC<ScanDocumentFormProps> = ({ onSubmit, onClose, actionType }) => {
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