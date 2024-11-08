// Helper function to format strings for badges (no more underscore and it is always lowercase)
export const formatBadgeText = (text: string) => {
    return text
        .replace(/[^a-zA-Z ]/g, '')
        .split('_')
        .join(' ')
        .toLowerCase();
};

// Function to get status variant
export const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'secondary';
        case 'in progress':
            return 'default';
        case 'completed':
            return 'outline';
        default:
            return 'secondary';
    }
};
