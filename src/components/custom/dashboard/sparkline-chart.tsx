// src\components\custom\dashboard\sparkline-chart.tsx
import { useEffect, useState } from 'react'
import { LineChart, Line } from 'recharts'

interface SparklineChartProps {
    data: Array<{ value: number }>
}

export const SparklineChart: React.FC<SparklineChartProps> = ({ data }) => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return <div className='h-[40px]' />
    }

    return (
        <div className='h-[40px] mt-3'>
            <LineChart data={data} width={200} height={40}>
                <Line
                    type='monotone'
                    dataKey='value'
                    stroke='hsl(var(--primary))'
                    strokeWidth={2}
                    dot={{ r: 2, fill: '#fff' }}
                />
            </LineChart>
        </div>
    )
}