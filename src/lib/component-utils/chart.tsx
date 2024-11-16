// src\lib\component-utils\chart.tsx
import { Package, CheckCircle, Send, Check, BarChart3 } from 'lucide-react'

export function getIconForStatus(status: string): React.ElementType {
    const icons: Record<string, React.ElementType> = {
        Incoming: Package,
        Received: CheckCircle,
        Outgoing: Send,
        Completed: Check,
        For_dispatch: BarChart3
    }
    return icons[status] || CheckCircle
}

export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        Incoming: 'hsl(var(--chart-2))',
        Received: '#34D399',
        Outgoing: 'hsl(var(--chart-3))',
        Completed: 'hsl(var(--chart-4))',
        For_dispatch: '#818CF8',
        Dispatch: 'hsl(var(--chart-1))',
        Intransit: 'hsl(var(--chart-4))',
    }
    return colors[status] || 'hsl(var(--primary))'
}