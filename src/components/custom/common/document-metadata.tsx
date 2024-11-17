import { format, parseISO } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import { formatBadgeText, formatBadgeTextAllCaps, getStatusVariant } from '@/lib/controls'
import { Separator } from '@/components/ui/separator'
import { Document } from '@/lib/faker/documents/schema'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import DocumentCodeCell from './code-cell/document-code-cell'

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

interface MetadataItemProps {
    icon: React.ElementType
    label: string
    value: string
    subValue?: {
        label: string
        value: string
        variant?: BadgeVariant
    }
    variant?: BadgeVariant
    tooltip?: string
}

const MetadataItem = ({
    icon: Icon,
    label,
    value,
    subValue,
    variant,
    tooltip,
    tooltipSide = 'right', // Default tooltip side
}: MetadataItemProps & { tooltipSide?: 'left' | 'right' }) => (
    <div className="relative">
        <HoverCard openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
                <div className="p-4 rounded-lg bg-muted shadow-sm hover:bg-accent transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6 shrink-0 text-muted-foreground" />
                        <div className="flex flex-col gap-1 min-w-0">
                            <span className="text-xs font-medium text-muted-foreground truncate">
                                {label}
                            </span>
                            {variant ? (
                                <Badge variant={variant} className="text-sm">
                                    {value}
                                </Badge>
                            ) : (
                                <span className="text-sm font-medium truncate">{value}</span>
                            )}
                            {subValue && (
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-muted-foreground truncate">
                                        {subValue.label}:
                                    </span>
                                    {subValue.variant ? (
                                        <Badge
                                            variant={subValue.variant}
                                            className="text-xs py-1 px-3"
                                        >
                                            {subValue.value}
                                        </Badge>
                                    ) : (
                                        <span className="text-xs truncate">{subValue.value}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </HoverCardTrigger>
            <HoverCardContent
                side={tooltipSide} // Dynamically set tooltip side
                align="start"
                sideOffset={10}
                className="w-80 z-50 bg-card rounded-lg shadow-lg p-4"
                avoidCollisions
            >
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <h4 className="font-semibold">{label}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{value}</p>
                    {subValue && (
                        <div className="text-sm">
                            <span className="text-muted-foreground">{subValue.label}:</span>{' '}
                            {subValue.value}
                        </div>
                    )}
                    {tooltip && (
                        <p className="text-xs text-muted-foreground italic">{tooltip}</p>
                    )}
                </div>
            </HoverCardContent>
        </HoverCard>
    </div>
)

const DocumentMetadata = ({ item }: { item: Document }) => (
    <Card className="relative border rounded-lg shadow-md">
        <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Document Metadata</h3>
        </div>
        <CardContent className="p-4">
            <ScrollArea className="max-h-[calc(100vh-250px)] pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MetadataItem
                        icon={Icons.user}
                        label="Created By"
                        value={item.created_by}
                        subValue={{
                            label: 'Office',
                            value: formatBadgeText(item.origin_office),
                            variant: 'secondary',
                        }}
                        tooltip="Document creator and their office of origin"
                    />
                    <MetadataItem
                        icon={Icons.calendarIcon}
                        label="Date Created"
                        value={format(parseISO(item.date_created), 'PPP')}
                        tooltip="Date when the document was created"
                        tooltipSide="left"
                    />
                    <Separator className="col-span-1 md:col-span-2 my-2" />
                    <MetadataItem
                        icon={Icons.shield}
                        label="Classification"
                        value={formatBadgeTextAllCaps(item.classification)}
                        variant="secondary"
                        tooltip="Security classification level of the document"
                    />
                    <MetadataItem
                        icon={Icons.tag}
                        label="Status"
                        value={formatBadgeTextAllCaps(item.status)}
                        variant={getStatusVariant(item.status)}
                        tooltip="Current processing status of the document"
                        tooltipSide="left"
                    />
                    {item.date_release && (
                        <MetadataItem
                            icon={Icons.calendarClock}
                            label="Release Date"
                            value={format(parseISO(item.date_release), 'PPP')}
                            tooltip="Date when the document was released"
                        />
                    )}
                    {item.released_by && (
                        <MetadataItem
                            icon={Icons.userCheck}
                            label="Released By"
                            value={item.released_by}
                            subValue={
                                item.released_from
                                    ? { label: 'From', value: item.released_from, variant: 'outline' }
                                    : undefined
                            }
                            tooltip="Person who released the document and their office"
                        />
                    )}
                    {item.receiving_office && (
                        <MetadataItem
                            icon={Icons.building}
                            label="Receiving Office"
                            value={item.receiving_office}
                            tooltip="Office designated to receive the document"
                        />
                    )}
                    {item.code && (
                        <div className="col-span-1 md:col-span-2">
                            <Card className="rounded-lg shadow-md">
                                <CardHeader className="p-4 text-center">
                                    <h4 className="text-sm font-semibold text-muted-foreground">
                                        QR Code and Barcode
                                    </h4>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center justify-center">
                                        {/* QR Code */}
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="flex items-center justify-center w-full max-w-[150px] md:max-w-[200px] lg:max-w-[250px]">
                                                <DocumentCodeCell code={item.code} type="QR" />
                                            </div>
                                            <span className="mt-2 text-xs text-muted-foreground">QR Code</span>
                                        </div>
                                        {/* Barcode */}
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="flex items-center justify-center w-full max-w-[300px] md:max-w-[400px] lg:max-w-[500px]">
                                                <DocumentCodeCell code={item.code} type="Barcode" />
                                            </div>
                                            <span className="mt-2 text-xs text-muted-foreground">Barcode</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </CardContent>
    </Card>
)

export default DocumentMetadata
