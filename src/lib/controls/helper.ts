// Helper function to format strings for badges (no more underscore and it is always lowercase)
export const formatBadgeText = (text: string) => {
    return text
        .replace(/_/g, ' ')
        .replace(/[^a-zA-Z ]/g, '')
        .toLowerCase()
}

// make things all capital
export const formatBadgeTextAllCaps = (text: string) => {
    return text
        .replace(/_/g, ' ')
        .replace(/[^a-zA-Z ]/g, '')
        .toUpperCase()
}

export const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value}%`
}

export const formatTime = (timestamp: string) => {
    try {
        const date = new Date(timestamp)
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `${hours}:${minutes}`
    } catch {
        return ''
    }
}

// Function to get status variant
export const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'secondary'
        case 'in progress':
            return 'default'
        case 'completed':
            return 'outline'
        default:
            return 'secondary'
    }
}