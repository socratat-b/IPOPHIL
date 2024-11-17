import Image from 'next/image'

import { useState } from 'react'
import { QrCodeIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { JoinedDocument } from '@/lib/dms/joined-docs'
import { useDocuments } from '@/lib/services/documents'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface HelpScanCardProps {
    onCodeChange: (code: string) => void
    actionType: 'Create' | 'Receive' | 'Release'
}

export const HelpScanCard: React.FC<HelpScanCardProps> = ({ onCodeChange, actionType }) => {
    const { documents = [] } = useDocuments()
    const [codeInput, setCodeInput] = useState<string>('')
    const [documentDetails, setDocumentDetails] = useState<JoinedDocument | null>(null)

    const handleInputChange = (value: string) => {
        setCodeInput(value)
        onCodeChange(value)
        populateDocumentDetails(value)
    }

    const populateDocumentDetails = (code: string) => {
        const document = documents.find((doc: JoinedDocument) => doc.code === code)

        if (document) {
            setDocumentDetails(document)
        } else {
            setDocumentDetails(null)
        }
    }

    return (
        <div className='bg-white flex flex-col md:flex-row gap-8 p-6'>
            {/* Instructions Card */}
            <Card className='flex-1 min-w-[300px] shadow-md rounded-lg bg-white'>
                <CardHeader>
                    <CardTitle className='text-lg font-semibold text-center text-gray-800'>
                        {actionType === 'Receive'
                            ? 'Receiving Instructions'
                            : actionType === 'Release'
                                ? 'Release Instructions'
                                : 'Scanning Instructions'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-sm mb-4 text-gray-600 text-center'>
                        {actionType === 'Receive'
                            ? 'Follow these steps to receive the document using a scanner.'
                            : actionType === 'Release'
                                ? 'Follow these steps to release the document using a scanner.'
                                : 'Follow these steps to scan the document’s QR or Barcode using a dedicated scanner.'}
                    </p>
                    <ol className='text-sm list-decimal list-inside space-y-2 text-gray-700'>
                        <li>Enter the document code in the input box on the right.</li>
                        <li>Click the scan button to populate the document details.</li>
                        {actionType === 'Receive' && (
                            <li>Verify the receiving office and ensure it matches your department.</li>
                        )}
                        {actionType === 'Release' && (
                            <li>Ensure the document details match before proceeding to release.</li>
                        )}
                    </ol>
                    <div className='flex justify-center mt-6'>
                        <Image src='/images/scan.png' alt='Scan Icon' width={100} height={100} />
                    </div>
                </CardContent>
            </Card>

            {/* Details Card */}
            <Card className='flex-1 min-w-[300px] shadow-md rounded-lg bg-white'>
                <CardHeader className='flex items-center space-x-2'>
                    <QrCodeIcon className='w-5 h-5 text-green-500' />
                    <CardTitle className='text-lg font-semibold text-gray-800'>
                        Document Details - {actionType}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='flex items-center gap-2 mb-4'>
                        <Input
                            id='code'
                            placeholder='Enter document code'
                            value={codeInput}
                            onChange={(e) => handleInputChange(e.target.value)}
                            className='flex-grow'
                        />
                        <Button
                            variant='outline'
                            onClick={() => populateDocumentDetails(codeInput)}
                            className='bg-green-500 text-white'
                        >
                            <QrCodeIcon className='w-4 h-4 mr-1' /> Scan
                        </Button>
                    </div>

                    {documentDetails && (
                        <div className='grid grid-cols-2 gap-4 text-sm'>
                            <div>
                                <label className='block font-medium text-gray-700'>Origin Office</label>
                                <Input
                                    value={documentDetails.origin_office}
                                    readOnly
                                    className='bg-gray-100 text-sm'
                                />
                            </div>
                            <div>
                                <label className='block font-medium text-gray-700'>Subject/Title</label>
                                <Input
                                    value={documentDetails.title}
                                    readOnly
                                    className='bg-gray-100 text-sm'
                                />
                            </div>
                            <div>
                                <label className='block font-medium text-gray-700'>Classification</label>
                                <Input
                                    value={documentDetails.classification}
                                    readOnly
                                    className='bg-gray-100 text-sm'
                                />
                            </div>
                            <div>
                                <label className='block font-medium text-gray-700'>Type</label>
                                <Input value={documentDetails.type} readOnly className='bg-gray-100 text-sm' />
                            </div>
                            <div>
                                <label className='block font-medium text-gray-700'>Created By</label>
                                <Input
                                    value={documentDetails.created_by}
                                    readOnly
                                    className='bg-gray-100 text-sm'
                                />
                            </div>
                            <div>
                                <label className='block font-medium text-gray-700'>Date Created</label>
                                <Input
                                    value={new Date(documentDetails.date_created).toLocaleDateString()}
                                    readOnly
                                    className='bg-gray-100 text-sm'
                                />
                            </div>
                            <div>
                                <label className='block font-medium text-gray-700'>Status</label>
                                <Input
                                    value={documentDetails.status}
                                    readOnly
                                    className='bg-gray-100 text-sm'
                                />
                            </div>
                            <div className='col-span-2'>
                                <label className='block font-medium text-gray-700'>Remarks</label>
                                <Input
                                    value={documentDetails.remarks || 'N/A'}
                                    readOnly
                                    className='bg-gray-100 text-sm'
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
