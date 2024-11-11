"use client";

import React, { useEffect, useRef, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ResponsiveContainer } from "recharts";
import { Document } from "@/lib/faker/documents/schema";
import { useTheme } from "next-themes";

interface OverviewProps {
    documents: Document[]
}

export function Overview({ documents }: OverviewProps) {
    const { theme } = useTheme();
    const [chartType, setChartType] = useState("Pie Chart");
    const [chartWidth, setChartWidth] = useState(0);
    const [chartHeight, setChartHeight] = useState(0);
    const [isClickedOutside, setIsClickedOutside] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            setChartWidth(containerRef.current.offsetWidth);
            setChartHeight(containerRef.current.offsetHeight);
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsClickedOutside(true);
                setTimeout(() => setIsClickedOutside(false), 300);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const data = documents.reduce((acc, doc) => {
        const status = doc.status.charAt(0).toUpperCase() + doc.status.slice(1);
        const existingStatus = acc.find(item => item.name === status);
        
        if (existingStatus) {
            existingStatus.value++;
        } else {
            acc.push({
                name: status,
                value: 1,
                color: getStatusColor(status),
                percentage: 0
            });
        }
        return acc;
    }, [] as Array<{
        percentage: number;
        name: string;
        value: number;
        color: string 
    }>);

    const total = documents.length;
    data.forEach(item => {
        item.percentage = Number(((item.value / total) * 100).toFixed(1));
    });

    function getStatusColor(status: string) {
        // Use CSS variables for colors
        const colors = {
            Incoming: 'hsl(var(--chart-1))',
            Received: 'hsl(var(--chart-2))',
            Outgoing: 'hsl(var(--chart-3))',
            Completed: 'hsl(var(--chart-4))',
            For_dispatch: 'hsl(var(--chart-5))'
        };
        return colors[status as keyof typeof colors] || 'hsl(var(--muted))';
    }

    function getStatusIcon(status: string) {
        const icons = {
            Incoming: "📥",
            Received: "📬",
            Outgoing: "📤",
            Completed: "✅",
            For_dispatch: "📦"
        };
        return icons[status as keyof typeof icons] || "📄";
    }

    const isDark = theme === 'dark';

    return (
        <div className="w-full rounded-lg relative bg-card">
            <div className="absolute top-2 right-2 z-10">
                <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    className="px-3 py-1 rounded-lg bg-background text-foreground border-border 
                             focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                    <option value="Pie Chart">Pie Chart</option>
                    <option value="Bar Chart">Bar Chart</option>
                    <option value="Line Chart">Line Chart</option>
                </select>
            </div>

            <div ref={containerRef} className="relative h-[350px] flex justify-center items-center">
                {chartWidth > 0 && chartHeight > 0 && (
                    <>
                        {chartType === "Pie Chart" && (
                            <PieChart width={chartWidth} height={chartHeight}>
                                <Pie
                                    data={data}
                                    cx={chartWidth / 2}
                                    cy={chartHeight / 2}
                                    innerRadius={90}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                    animationDuration={800}
                                    isAnimationActive={true}
                                >
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                            strokeWidth={0}
                                            style={{
                                                transform: isClickedOutside ? "scale(1.05)" : "scale(1)",
                                                transition: "transform 0.3s ease-in-out",
                                                cursor: "pointer"
                                            }}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value, name, props) => [
                                        `${value} documents`,
                                        `${name} - ${(props.payload as any).percentage}%`
                                    ]}
                                    contentStyle={{ 
                                        borderRadius: '8px',
                                        padding: '10px',
                                        fontSize: '0.9rem',
                                        backgroundColor: isDark ? 'hsl(var(--popover))' : 'white',
                                        color: isDark ? 'hsl(var(--popover-foreground))' : 'inherit',
                                        border: '1px solid hsl(var(--border))'
                                    }}
                                    labelStyle={{ fontWeight: 'bold' }}
                                />
                            </PieChart>
                        )}
                        {chartType === "Bar Chart" && (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke={isDark ? 'hsl(var(--muted))' : '#e5e5e5'}
                                    />
                                    <XAxis
                                        dataKey="name"
                                        stroke={isDark ? 'hsl(var(--foreground))' : 'inherit'}
                                    />
                                    <YAxis stroke={isDark ? 'hsl(var(--foreground))' : 'inherit'} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: isDark ? 'hsl(var(--popover))' : 'white',
                                            color: isDark ? 'hsl(var(--popover-foreground))' : 'inherit',
                                            border: '1px solid hsl(var(--border))'
                                        }}
                                    />
                                    <Bar dataKey="value">
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                        {chartType === "Line Chart" && (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke={isDark ? 'hsl(var(--muted))' : '#e5e5e5'}
                                    />
                                    <XAxis
                                        dataKey="name"
                                        stroke={isDark ? 'hsl(var(--foreground))' : 'inherit'}
                                    />
                                    <YAxis stroke={isDark ? 'hsl(var(--foreground))' : 'inherit'} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: isDark ? 'hsl(var(--popover))' : 'white',
                                            color: isDark ? 'hsl(var(--popover-foreground))' : 'inherit',
                                            border: '1px solid hsl(var(--border))'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </>
                )}
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-6 text-muted-foreground">
                {data.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-1">
                            <span className="text-lg">{getStatusIcon(entry.name)}</span>
                            <span
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                        </div>
                        <span className="text-foreground font-semibold">{entry.percentage}%</span>
                        <span>{entry.name.replace(/_/g, ' ')}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}