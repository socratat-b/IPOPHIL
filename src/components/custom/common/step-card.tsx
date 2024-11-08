import { StepStatus } from "@/lib/types";
import { Check, Clock, AlertCircle } from "lucide-react";

export const StepIcon = ({ status }: { status: StepStatus }) => {
    switch (status) {
        case 'completed':
            return <Check className="h-4 w-4" />;
        case 'current':
            return <Clock className="h-4 w-4 animate-pulse" />;
        case 'error':
            return <AlertCircle className="h-4 w-4" />;
        default:
            return <div className="h-4 w-4 rounded-full border-2" />;
    }
};