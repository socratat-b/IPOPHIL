import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Document } from "@/lib/faker/documents/schema"
import { format, parseISO } from "date-fns"
import { Icons } from "@/components/ui/icons"
import { getStatusVariant } from "@/lib/controls"
import DocumentRouting from "./document-routing"
import { Separator } from "@/components/ui/separator"

interface DocumentDialogProps {
    item: Document | null
    open: boolean
    onClose: () => void
}

interface MetadataItemProps {
    icon: React.ElementType
    label: string
    value: string
    subValue?: {
        label: string
        value: string
        variant?: "default" | "secondary" | "destructive" | "outline"
    }
    variant?: "default" | "secondary" | "destructive" | "outline"
}

const MetadataItem = ({
    icon: Icon,
    label,
    value,
    subValue,
    variant
}: MetadataItemProps) => (
    <div className="space-y-1.5">
        <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{label}:</span>
                {variant ? (
                    <Badge variant={variant}>
                        {value}
                    </Badge>
                ) : (
                    <span className="text-sm font-medium">{value}</span>
                )}
            </div>
        </div>
        {subValue && (
            <div className="ml-6 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{subValue.label}:</span>
                {subValue.variant ? (
                    <Badge variant={subValue.variant}>
                        {subValue.value}
                    </Badge>
                ) : (
                    <span className="text-sm font-medium">{subValue.value}</span>
                )}
            </div>
        )}
    </div>
);

const DocumentMetadata = ({ item }: { item: Document }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetadataItem
                icon={Icons.user}
                label="Created By"
                value={item.created_by}
                subValue={{
                    label: "Office",
                    value: item.origin_office,
                    variant: "secondary"
                }}
            />
            <MetadataItem
                icon={Icons.calendarIcon}
                label="Date Created"
                value={format(parseISO(item.date_created), "PPP")}
            />
            <MetadataItem
                icon={Icons.shield}
                label="Classification"
                value={item.classification}
                variant="secondary"
            />
            <MetadataItem
                icon={Icons.tag}
                label="Status"
                value={item.status}
                variant={getStatusVariant(item.status)}
            />
            <MetadataItem
                icon={Icons.tag}
                label="Type"
                value={item.type}
                variant="outline"
            />
        </div>
    </div>
);

export const DocumentDialog: React.FC<DocumentDialogProps> = ({ item, open, onClose }) => {
    if (!item) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-[90vw] w-[1000px] h-[90vh] flex flex-col overflow-hidden p-0">
                <div className="flex flex-col h-full">
                    <DialogHeader className="p-4">
                        <DialogTitle>{item.title}</DialogTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Icons.fileText className="h-4 w-4" />
                            CODE: {item.code}
                        </div>
                    </DialogHeader>

                    <Separator />

                    <Tabs defaultValue="routing" className="flex-1 flex flex-col">
                        <div className="px-6 py-2 flex">
                            <TabsList className="grid grid-cols-2 w-auto">
                                <TabsTrigger value="routing">Routing</TabsTrigger>
                                <TabsTrigger value="details">Details</TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="px-6 py-2">
                            <TabsContent value="routing" className="m-0 mt-0">
                                <DocumentRouting document={item} />
                            </TabsContent>
                            <TabsContent value="details" className="m-0 mt-0">
                                <DocumentMetadata item={item} />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
};