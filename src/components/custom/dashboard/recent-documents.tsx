"use client"

import { useState } from 'react';
import { Document } from '@/lib/faker/documents/schema';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { format, parseISO } from 'date-fns';
import { FolderIcon } from 'lucide-react';
import { formatBadgeText, getStatusVariant } from '@/lib/controls';
import { DocumentDialog } from '../common/document-dialog';

interface RecentDocumentsProps {
    documents: Document[];
}

const RecentDocuments: React.FC<RecentDocumentsProps> = ({ documents }) => {
    const [selectedItem, setSelectedItem] = useState<Document | null>(null);

    // Function to handle card click
    const handleCardClick = (doc: Document) => {
        setSelectedItem(doc);
    };

    return (
        <>
            <div className="space-y-4">
                {documents.map((doc, index) => (
                    <Card
                        key={doc.id}
                        className="transition-all hover:bg-accent cursor-pointer"
                        onClick={() => handleCardClick(doc)}
                    >
                        <CardContent className="p-4 flex items-center gap-4">
                            <Avatar className="h-12 w-12 flex-shrink-0">
                                <AvatarImage src={`/images/doc-icon-${index + 1}.jpg`} alt="Document Icon" />
                                <AvatarFallback className="bg-primary/10">
                                    <FolderIcon className="h-6 w-6" />
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-grow min-w-0">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <h4 className="font-medium text-sm truncate">
                                                {doc.title}
                                            </h4>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{doc.title}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <Badge variant={"outline"} className="text-xs">
                                        {doc.code}
                                    </Badge>
                                    <Badge variant={getStatusVariant(doc.status)} className="text-xs">
                                        {formatBadgeText(doc.status)}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                <Badge variant={"secondary"} className="whitespace-nowrap">
                                    {formatBadgeText(doc.origin_office)}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    {format(parseISO(doc.date_created), 'MMM d, yyyy')}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
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