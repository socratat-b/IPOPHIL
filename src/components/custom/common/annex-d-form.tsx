import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const AnnexDForm = () => {
    const currentDate = new Date()
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
    const formattedTime = currentDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    })

    return (
        <Card className='w-full max-w-4xl mx-auto'>
            <CardHeader className='px-6 py-4'>
                <div className='flex justify-between items-center'>
                    <span className='text-sm text-muted-foreground'>
                        ref. no. {new Date().getFullYear()}-DOC Number
                    </span>
                    <div className='flex items-center space-x-2'>
                        <Label htmlFor='urgent' className='text-sm'>
                            Urgent
                        </Label>
                        <Checkbox id='urgent' />
                    </div>
                </div>
            </CardHeader>

            <CardContent className='p-0'>
                <div className='rounded-md border'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='w-[200px]'>Date/Time</TableHead>
                                <TableHead>To</TableHead>
                                <TableHead>From</TableHead>
                                <TableHead>Action Required</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* First row with current date/time */}
                            <TableRow>
                                <TableCell className='align-top'>
                                    <div className='text-muted-foreground'>
                                        <div>{formattedDate}</div>
                                        <div>{formattedTime}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type='text'
                                        className='border-0 shadow-none focus-visible:ring-0 px-0 h-8'
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type='text'
                                        className='border-0 shadow-none focus-visible:ring-0 px-0 h-8'
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type='text'
                                        className='border-0 shadow-none focus-visible:ring-0 px-0 h-8'
                                    />
                                </TableCell>
                            </TableRow>

                            {/* Additional rows */}
                            {[...Array(7)].map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Input
                                            type='text'
                                            className='border-0 shadow-none focus-visible:ring-0 px-0 h-8'
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type='text'
                                            className='border-0 shadow-none focus-visible:ring-0 px-0 h-8'
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type='text'
                                            className='border-0 shadow-none focus-visible:ring-0 px-0 h-8'
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type='text'
                                            className='border-0 shadow-none focus-visible:ring-0 px-0 h-8'
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

export default AnnexDForm