// DocumentMetadata.tsx
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/ui/icons";
import { format, parseISO } from "date-fns";
import { Document } from "@/lib/faker/documents/schema";
import { getStatusVariant } from "@/lib/controls";

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
}

const MetadataItem = ({
    icon: Icon,
    label,
    value,
    subValue,
    variant,
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
        <div className="grid grid-cols-2 gap-6">
            <MetadataItem
                icon={Icons.user}
                label="Created By"
                value={item.created_by}
                subValue={{
                    label: "Office",
                    value: item.origin_office,
                    variant: "secondary",
                }}
            />
            <MetadataItem
                icon={Icons.calendarIcon}
                label="Date Created"
                value={format(parseISO(item.date_created), "PPP")}
            />
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-6">
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

export default DocumentMetadata;
