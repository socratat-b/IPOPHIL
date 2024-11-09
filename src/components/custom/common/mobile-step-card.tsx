import { useState } from "react";
import { format, parseISO } from "date-fns";
import { ChevronDown, Eye, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getStepVariant } from "@/lib/component-utils/status";
import { RoutingStep } from "@/lib/types";
import { StepIcon } from "./step-card";

interface MobileStepCardProps {
    step: RoutingStep;
}

export const MobileStepCard = ({ step }: MobileStepCardProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <Card>
                <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <StepIcon status={step.status} />
                                <span>{step.title}</span>
                            </div>
                            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </div>
                    </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Date:</span>
                                <span>{step.date ? format(parseISO(step.date), 'PPP') : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Status:</span>
                                <Badge variant={getStepVariant(step.status)}>
                                    {step.status}
                                </Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Description:</span>
                                <span className="text-right">{step.description}</span>
                            </div>
                        </div>
                        {step.status === 'current' && (
                            <div className="flex gap-2">
                                <Button size="sm" variant="default">
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                </Button>
                                <Button size="sm" variant="outline">
                                    <Send className="h-4 w-4 mr-2" />
                                    Forward
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
};