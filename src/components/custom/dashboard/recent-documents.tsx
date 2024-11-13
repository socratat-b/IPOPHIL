import { useState } from 'react';
import { Document } from '@/lib/faker/documents/schema';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, parseISO } from 'date-fns';
import { FolderIcon, ChevronRight, ShieldAlert } from 'lucide-react';
import { formatBadgeText, getStatusVariant } from '@/lib/controls';
import { DocumentDialog } from '../common/document-dialog';

interface RecentDocumentsProps {
    documents: Document[];
}

const RecentDocuments: React.FC<RecentDocumentsProps> = ({ documents }) => {
    const [selectedItem, setSelectedItem] = useState<Document | null>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const handleCardClick = (doc: Document) => {
        setSelectedItem(doc);
    };

    const getClassificationColor = (classification: string) => {
        switch (classification.toLowerCase()) {
            case 'confidential':
                return 'bg-red-100 text-red-700';
            case 'restricted':
                return 'bg-orange-100 text-orange-700';
            case 'internal':
                return 'bg-blue-100 text-blue-700';
            default:
                return 'bg-green-100 text-green-700';
        }
    };

    return (
        <>
            <div className="space-y-3">
                {documents.map((doc, index) => (
                    <TooltipProvider key={doc.id} delayDuration={300}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Card
                                    className={`group transition-all duration-200 hover:bg-accent/50 hover:shadow-md cursor-pointer border-l-4 ${
                                        hoveredId === doc.id ? 'border-l-primary' : 'border-l-transparent'
                                    }`}
                                    onClick={() => handleCardClick(doc)}
                                    onMouseEnter={() => setHoveredId(doc.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                >
                                    <CardContent className="p-4 flex items-center gap-4 relative">
                                        <Avatar className="h-12 w-12 flex-shrink-0 ring-2 ring-background transition-transform group-hover:scale-105">
                                            <AvatarImage 
                                                src={''} 
                                                alt="Document Icon"
                                                className="object-cover"
                                            />
                                            <AvatarFallback className="bg-primary/10">
                                                <FolderIcon className="h-6 w-6 text-primary" />
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-grow min-w-0">
                                            <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                                                {doc.title}
                                            </h4>

                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                <Badge variant="outline" className="text-xs font-medium">
                                                    {doc.code}
                                                </Badge>
                                                <Badge 
                                                    variant={getStatusVariant(doc.status)} 
                                                    className="text-xs font-medium"
                                                >
                                                    {formatBadgeText(doc.status)}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                            <Badge 
                                                variant="secondary" 
                                                className="whitespace-nowrap font-medium"
                                            >
                                                {formatBadgeText(doc.origin_office)}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {format(parseISO(doc.date_created), 'MMM d, yyyy')}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TooltipTrigger>
                            <TooltipContent 
                                side="top"
                                align="end" // Aligns the tooltip to the right
                                className={`px-3 py-2 flex items-center gap-2 font-medium ${getClassificationColor(doc.classification)}`}
                            >

                                <ShieldAlert className="h-4 w-4" />
                                <p className="text-sm capitalize">{doc.classification || 'Public'}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ))}
            </div>

            <DocumentDialog
                item={selectedItem}
                open={!!selectedItem}
                onClose={() => setSelectedItem(null)}
            />
        </>
    );
};

export default RecentDocuments;