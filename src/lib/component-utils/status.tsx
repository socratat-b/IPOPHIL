import { StepStatus } from "../types";

export const getStepVariant = (status: StepStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'completed':
            return 'default';
        case 'current':
            return 'secondary';
        case 'error':
            return 'destructive';
        default:
            return 'outline';
    }
};