// src\components\custom\dashboard\custom-tooltip.tsx
import { motion } from 'framer-motion'
import { ChartDataItem } from '@/lib/types'
import { getIconForStatus } from '@/lib/component-utils/chart'

interface TooltipProps {
    active?: boolean
    payload?: Array<{
        payload: ChartDataItem
    }>
}

export const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload
        const Icon = getIconForStatus(data.name)
        return (
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className='bg-popover p-3 rounded-lg shadow-lg border border-border'
                style={{
                    transform: 'translateY(100%)',
                    marginLeft: '10px',
                    zIndex: 50,
                    position: 'relative',
                }}
            >
                <div className='flex items-center gap-2 mb-2'>
                    <Icon className='w-4 h-4' style={{ color: data.color }} />
                    <span className='font-semibold text-popover-foreground'>{data.name}</span>
                </div>
                <div className='text-sm text-muted-foreground'>
                    <div>Count: {data.value}</div>
                    <div>Percentage: {data.percentage}%</div>
                </div>
            </motion.div>
        )
    }
    return null
}