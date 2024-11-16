// src\components\custom\dashboard\overview.tsx
'use client'

import Image from 'next/image'

import { useState, useRef, useEffect } from 'react'
import { Document } from '@/lib/faker/documents/schema'
import { motion, AnimatePresence } from 'framer-motion'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { ChartPie, BarChart3, LineChart as LineIcon } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ResponsiveContainer } from 'recharts'
import { CustomTooltip } from './custom-tooltip'
import { ChartDataItem } from '@/lib/types'
import { getIconForStatus, getStatusColor } from '@/lib/component-utils/chart'

interface OverviewProps {
    documents: Document[]
}

export function Overview({ documents }: OverviewProps) {
    const [chartType, setChartType] = useState('Pie Chart')
    const [chartWidth, setChartWidth] = useState(0)
    const [chartHeight, setChartHeight] = useState(0)
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
    const [hoveredStatus, setHoveredStatus] = useState<string | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (containerRef.current) {
            setChartWidth(containerRef.current.offsetWidth)
            setChartHeight(containerRef.current.offsetHeight)
        }

        const handleResize = () => {
            if (containerRef.current) {
                setChartWidth(containerRef.current.offsetWidth)
                setChartHeight(containerRef.current.offsetHeight)
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const data: ChartDataItem[] = documents.reduce((acc: ChartDataItem[], doc) => {
        const status = doc.status.charAt(0).toUpperCase() + doc.status.slice(1);
        const existingStatus = acc.find(item => item.name === status);

        if (existingStatus) {
            existingStatus.value++;
        } else {
            acc.push({
                name: status,
                value: 1,
                color: getStatusColor(status),
                percentage: 0,
            });
        }
        return acc;
    }, []);

    const total = documents.length;
    data.forEach(item => {
        item.percentage = Number(((item.value / total) * 100).toFixed(1));
    });

    const chartColors = {
        pie: data.map(item => item.color),
        bar: [
            'hsl(var(--chart-1))',
            'hsl(var(--chart-4))',
            'hsl(var(--chart-3))',
            'hsl(var(--chart-2))',
            'hsl(var(--chart-5))'
        ],
        line: 'hsl(var(--primary))'
    }

    return (
        <div className='w-full pt-6'>
            <div className='flex justify-between items-center mb-2'>
                <div className='space-y-1'>
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='text-l font-bold text-foreground tracking-tight pl-4'
                    >
                        Document Status Overview
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className='text-sm text-muted-foreground pl-4'
                    >
                        Total Documents: {total}
                    </motion.p>
                </div>
                <Select
                    value={chartType}
                    onValueChange={setChartType}
                >
                    <SelectTrigger className='w-[180px] bg-background hover:bg-hvr-clr transition-colors shadow-sm rounded-md border-gray-200'>
                        <div className='flex items-center gap-2'>
                            {chartType === 'Pie Chart' && <ChartPie className='w-4 h-4' />}
                            {chartType === 'Bar Chart' && <BarChart3 className='w-4 h-4' />}
                            {chartType === 'Line Chart' && <LineIcon className='w-4 h-4' />}
                            <span>{chartType}</span>
                        </div>
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value='Pie Chart'>
                            <div className='flex items-center gap-2'>
                                <ChartPie className='w-4 h-4' />
                                Pie Chart
                            </div>
                        </SelectItem>
                        <SelectItem value='Bar Chart'>
                            <div className='flex items-center gap-2'>
                                <BarChart3 className='w-4 h-4' />
                                Bar Chart
                            </div>
                        </SelectItem>
                        <SelectItem value='Line Chart'>
                            <div className='flex items-center gap-2'>
                                <LineIcon className='w-4 h-4' />
                                Line Chart
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <AnimatePresence mode='wait'>
                <motion.div
                    key={chartType}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    ref={containerRef}
                    className='relative h-[400px] w-full'
                >
                    {chartWidth > 0 && chartHeight > 0 && (
                        <ResponsiveContainer width='100%' height='100%'>
                            {chartType === 'Pie Chart' ? (
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx='50%'
                                        cy='50%'
                                        innerRadius={120}
                                        outerRadius={180}
                                        paddingAngle={1}
                                        cornerRadius={6}
                                        dataKey='value'
                                        onClick={(_, index) => {
                                            const status = data[index].name
                                            setSelectedStatus(selectedStatus === status ? null : status)
                                        }}
                                        onMouseEnter={(_, index) => {
                                            setHoveredStatus(data[index].name)
                                        }}
                                        onMouseLeave={() => {
                                            setHoveredStatus(null)
                                        }}
                                    >
                                        {data.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                                opacity={
                                                    hoveredStatus === entry.name ? 1 :
                                                        selectedStatus === entry.name ? 1 :
                                                            selectedStatus ? 0.3 :
                                                                hoveredStatus ? 0.3 : 1
                                                }
                                                className='transition-all duration-300 cursor-pointer'
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            ) : chartType === 'Bar Chart' ? (
                                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray='3 3' stroke='#E2E8F0' />
                                    <XAxis dataKey='name' stroke='#64748B' />
                                    <YAxis stroke='#64748B' />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar
                                        dataKey='value'
                                        radius={[6, 6, 0, 0]}
                                    >
                                        {data.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={chartColors.bar[index]}
                                                onClick={() => {
                                                    setSelectedStatus(selectedStatus === entry.name ? null : entry.name)
                                                }}
                                                onMouseEnter={() => {
                                                    setHoveredStatus(entry.name)
                                                }}
                                                onMouseLeave={() => {
                                                    setHoveredStatus(null)
                                                }}
                                                opacity={
                                                    hoveredStatus === entry.name ? 1 :
                                                        selectedStatus === entry.name ? 1 :
                                                            selectedStatus ? 0.3 :
                                                                hoveredStatus ? 0.3 : 1
                                                }
                                                className='transition-all duration-300 cursor-pointer'
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            ) : (
                                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray='3 3' stroke='#E2E8F0' />
                                    <XAxis dataKey='name' stroke='#64748B' />
                                    <YAxis stroke='#64748B' />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line
                                        type='monotone'
                                        dataKey='value'
                                        stroke={chartColors.line}
                                        strokeWidth={3}
                                        dot={{
                                            fill: chartColors.line,
                                            strokeWidth: 2,
                                            r: 6,
                                            className: 'transition-all duration-300'
                                        }}
                                        activeDot={{
                                            r: 8,
                                            fill: chartColors.line,
                                            className: 'transition-all duration-300',
                                            onClick: () => {
                                                const index = data.findIndex((d) => d.name === selectedStatus)
                                                if (index !== -1) {
                                                    const status = data[index].name
                                                    setSelectedStatus(selectedStatus === status ? null : status)
                                                }
                                            }
                                        }}

                                    />
                                </LineChart>
                            )}
                        </ResponsiveContainer>
                    )}
                    {chartType === 'Pie Chart' && (
                        <Image
                            src={'/images/cube.png'}
                            alt='Center Logo'
                            className='absolute'
                            height={50}
                            width={50}
                            style={{
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: 1,
                            }}
                        />

                    )}
                </motion.div>
            </AnimatePresence>

            <motion.div
                className='flex flex-wrap justify-center gap-3 mt-2'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                {data.map((entry, index) => {
                    const Icon = getIconForStatus(entry.name)
                    return (
                        <motion.div
                            key={index}
                            onClick={() => setSelectedStatus(selectedStatus === entry.name ? null : entry.name)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full ${selectedStatus === entry.name ? 'bg-gray-100 ring-2 ring-gray-200' : 'bg-gray-50'} transition-all duration-300 cursor-pointer shadow-sm`}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                        >
                            <Icon className='h-4 w-4' style={{ color: chartColors.pie[index] }} />
                            <span className='text-sm font-medium text-gray-700'>{entry.name.replace(/_/g, ' ')}</span>
                            <span className='text-sm text-gray-500'>{entry.percentage}%</span>
                        </motion.div>
                    )
                })}
            </motion.div>
        </div>
    )
}