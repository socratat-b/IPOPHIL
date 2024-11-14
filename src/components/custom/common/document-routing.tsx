import { format, parseISO } from 'date-fns'
import { Eye, Send } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DocumentRoutingProps, RoutingStep } from '@/lib/types'
import { MobileStepCard } from '@/components/custom/common/mobile-step-card'
import { StepIcon } from '@/components/custom/common/step-card'
import { getStepVariant } from '@/lib/component-utils/status'
import { formatBadgeTextAllCaps } from '@/lib/controls'

export default function DocumentRouting({ document }: DocumentRoutingProps) {
    const getRoutingSteps = (): RoutingStep[] => {
        const steps: RoutingStep[] = [
            {
                title: 'Document Created',
                description: `Created by ${document.created_by} from ${document.origin_office}`,
                status: 'completed',
                date: document.date_created,
                office: document.origin_office,
                user: document.created_by
            }
        ]

        if (document.date_release) {
            steps.push({
                title: 'Document Released',
                description: `Released by ${document.released_by} from ${document.released_from}`,
                status: 'completed',
                date: document.date_release,
                office: document.released_from,
                user: document.released_by
            })
        }

        if (document.receiving_office) {
            const status = document.date_viewed ? 'completed' : 'current'
            steps.push({
                title: 'Document Received',
                description: `Received by ${document.receiving_office}`,
                status,
                office: document.receiving_office
            })
        }

        if (document.date_viewed) {
            steps.push({
                title: 'Document Viewed',
                description: `Viewed on ${format(parseISO(document.date_viewed), 'PPP')}`,
                status: 'completed',
                date: document.date_viewed
            })
        }

        return steps
    }

    const steps = getRoutingSteps()

    return (
        <div className='space-y-6'>
            <Card>
                <CardHeader>
                    <div className='flex justify-between'>
                        <Badge variant='secondary'>{formatBadgeTextAllCaps(document.status)}</Badge>
                        <Badge>{formatBadgeTextAllCaps(document.classification)}</Badge>
                    </div>
                    <CardTitle>{document.title}</CardTitle>
                    <CardDescription>{document.remarks || 'No remarks available'}</CardDescription>
                </CardHeader>
            </Card>

            <div className='hidden md:block relative'>
                <div className='rounded-md border'>
                    <div className='overflow-hidden'>
                        <Table>
                            <TableHeader>
                                <TableRow className='bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10'>
                                    <TableHead className='w-[140px]'>Status</TableHead>
                                    <TableHead className='w-[120px]'>Date</TableHead>
                                    <TableHead className='w-[150px]'>Title</TableHead>
                                    <TableHead className='w-[200px]'>Description</TableHead>
                                    <TableHead className='min-w-[250px]'>Remarks</TableHead>
                                    <TableHead className='w-[140px] relative right-0'>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                        </Table>
                    </div>
                    <div className='relative'>
                        <ScrollArea className='h-[350px] overflow-x-hidden'>
                            <div className='min-w-full inline-block align-middle'>
                                <div className='overflow-hidden'>
                                    <Table>
                                        <TableBody>
                                            {steps.map((step, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className='w-[140px]'>
                                                        <Badge variant={getStepVariant(step.status)} className='flex items-center gap-2'>
                                                            <StepIcon status={step.status} />
                                                            {formatBadgeTextAllCaps(step.status)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className='w-[120px]'>{step.date ? format(parseISO(step.date), 'PPP') : 'N/A'}</TableCell>
                                                    <TableCell className='w-[150px]'>{step.title}</TableCell>
                                                    <TableCell className='w-[200px]'>{step.description}</TableCell>
                                                    <TableCell className='min-w-[250px]'>
                                                        {step.status === 'completed' ? 
                                                            `Document was successfully ${step.title.toLowerCase()} by ${step.user || 'Personnel'}.` : 
                                                            `Awaiting ${step.title.toLowerCase()} action.`}
                                                    </TableCell>
                                                                                                        <TableCell className='w-[140px]'>
                                                        {step.status === 'current' && (
                                                            <div className='flex gap-2'>
                                                                <Button size='sm' variant='default'>
                                                                    <Eye className='h-4 w-4 mr-2' />
                                                                    View
                                                                </Button>
                                                                <Button size='sm' variant='outline'>
                                                                    <Send className='h-4 w-4 mr-2' />
                                                                    Forward
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>

            <ScrollArea className='md:hidden h-[350px]'>
                <div className='space-y-4'>
                    {steps.map((step, index) => (
                        <MobileStepCard key={index} step={step} />
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}