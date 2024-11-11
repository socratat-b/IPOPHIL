import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";
import { formatBadgeText, formatBadgeTextAllCaps, getStatusVariant } from "@/lib/controls";
import { Separator } from "@/components/ui/separator";
import { Document } from "@/lib/faker/documents/schema";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface MetadataItemProps {
    icon: React.ElementType;
    label: string;
    value: string;
    subValue?: {
        label: string;
        value: string;
        variant?: BadgeVariant;
    };
    variant?: BadgeVariant;
    tooltip?: string;
}

const MetadataItem = ({
    icon: Icon,
    label,
    value,
    subValue,
    variant,
    tooltip,
}: MetadataItemProps) => (
    <div className="relative">
        <HoverCard openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
                <div className="p-3 rounded-lg bg-background shadow-sm cursor-pointer">
                    <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 shrink-0" />
                        <div className="flex flex-col gap-1 min-w-0">
                            <span className="text-xs truncate">
                                {label}
                            </span>
                            {variant ? (
                                <Badge variant={variant} className="w-fit text-sm">
                                    {value}
                                </Badge>
                            ) : (
                                <span className="text-sm font-medium truncate">{value}</span>
                            )}
                            {subValue && (
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="text-xs truncate">
                                        {subValue.label}:
                                    </span>
                                    {subValue.variant ? (
                                        <Badge
                                            variant={subValue.variant}
                                            className="text-xs py-0 px-2"
                                        >
                                            {subValue.value}
                                        </Badge>
                                    ) : (
                                        <span className="text-xs truncate">
                                            {subValue.value}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </HoverCardTrigger>
            <HoverCardContent
                side="right"
                align="start"
                sideOffset={12}
                className="w-80 z-50"
                avoidCollisions={true}
            >
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <h4 className="font-semibold">{label}</h4>
                    </div>
                    <p className="text-sm break-words">
                        {value}
                    </p>
                    {subValue && (
                        <div className="text-sm">
                            <span className="text-muted-foreground">{subValue.label}:</span>{" "}
                            {subValue.value}
                        </div>
                    )}
                    {tooltip && (
                        <p className="text-xs text-muted-foreground italic">
                            {tooltip}
                        </p>
                    )}
                </div>
            </HoverCardContent>
        </HoverCard>
    </div>
);

const DocumentMetadata = ({ item }: { item: Document }) => (
    <Card className="relative">
        <div className="p-4 border-b border-muted">
            <h3 className="text-lg font-semibold">Document Metadata</h3>
        </div>
        <CardContent className="p-4">
            <ScrollArea className="max-h-[calc(100vh-240px)] pr-4 md:max-h-[calc(100vh-200px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MetadataItem
                        icon={Icons.user}
                        label="Created By"
                        value={item.created_by}
                        subValue={{
                            label: "Office",
                            value: formatBadgeText(item.origin_office),
                            variant: "secondary",
                        }}
                        tooltip="Document creator and their office of origin"
                    />
                    <MetadataItem
                        icon={Icons.calendarIcon}
                        label="Date Created"
                        value={format(parseISO(item.date_created), "PPP")}
                        tooltip="Date when the document was created"
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
                    />
                    {item.date_release && (
                        <MetadataItem
                            icon={Icons.calendarClock}
                            label="Release Date"
                            value={format(parseISO(item.date_release), "PPP")}
                            tooltip="Date when the document was released"
                        />
                    )}
                    {item.released_by && (
                        <MetadataItem
                            icon={Icons.userCheck}
                            label="Released By"
                            value={item.released_by}
                            subValue={item.released_from ? {
                                label: "From",
                                value: item.released_from,
                                variant: "outline"
                            } : undefined}
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
                </div>
            </ScrollArea>
        </CardContent>
    </Card>
);

export default DocumentMetadata;