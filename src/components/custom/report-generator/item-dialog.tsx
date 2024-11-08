import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Document } from "@/lib/faker/documents/schema"
import { format, parseISO } from "date-fns"
import { Icons } from "@/components/ui/icons"
import { getStatusVariant } from "@/lib/controls"

type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

interface ItemDialogProps {
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
        variant?: BadgeVariant
    }
    variant?: BadgeVariant
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

export const ItemDialog: React.FC<ItemDialogProps> = ({ item, open, onClose }) => {
    if (!item) return null

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{item.title}</DialogTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icons.fileText className="h-4 w-4" />
                        CODE: {item.code}
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Main Metadata Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Left Column - Creator & Office */}
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

                        {/* Right Column - Date Created */}
                        <MetadataItem
                            icon={Icons.calendarIcon}
                            label="Date Created"
                            value={format(parseISO(item.date_created), "PPP")}
                        />
                    </div>

                    <Separator />

                    {/* Document Properties */}
                    <div className="grid grid-cols-2 gap-6">
                        <MetadataItem
                            icon={Icons.shield}
                            label="Classification"
                            value={item.classification}
                            variant={"secondary"}
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
                            variant={"outline"}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
