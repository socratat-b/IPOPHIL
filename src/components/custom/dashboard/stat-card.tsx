// src\components\custom\dashboard\stat-card.tsx
import { ComponentType } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SparklineChart } from '@/components/custom/dashboard/sparkline-chart'

interface StatCardProps {
    title: string
    icon: ComponentType<{ className?: string }>
    count: number
    change: number
    data: Array<{ value: number }>
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    icon: Icon,
    count,
    change,
    data,
}) => (
    <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{title}</CardTitle>
            <Icon className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
            <div className='text-3xl font-bold pl-2'>{count}</div>
            <p className='text-xs text-muted-foreground pl-2'>
                {change > 0 ? '+' : ''}
                {change}% from last month
            </p>
            <div className='flex justify-center'>
                <SparklineChart data={data} />
            </div>
        </CardContent>
    </Card>
)