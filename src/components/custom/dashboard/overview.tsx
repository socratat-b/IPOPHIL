"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { useMemo } from "react"
import { Document } from "@/lib/faker/documents/schema"

interface OverviewProps {
    documents: Document[]
}

export function Overview({ documents }: OverviewProps) {
    const data = useMemo(() => {
        // Create an object to store document counts by month
        const monthCounts: { [key: string]: number } = {
            'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'May': 0, 'Jun': 0,
            'Jul': 0, 'Aug': 0, 'Sep': 0, 'Oct': 0, 'Nov': 0, 'Dec': 0
        }

        // Count documents for each month
        documents.forEach(doc => {
            const date = new Date(doc.date_created)
            const monthName = date.toLocaleString('default', { month: 'short' })
            monthCounts[monthName]++
        })

        // Convert to array format required by recharts
        return Object.entries(monthCounts).map(([name, total]) => ({
            name,
            total
        }))
    }, [documents])

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
                <Bar
                    dataKey="total"
                    fill="#3182ce"
                    radius={[4, 4, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}