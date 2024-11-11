"use client";

import React, { useEffect, useRef, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ResponsiveContainer } from "recharts";
import { Document } from "@/lib/faker/documents/schema";
import { useTheme } from "next-themes";
import { 
    MoveDown, 
    Inbox, 
    Send, 
    CheckCircle2, 
    Package,
    PieChart as PieChartIcon,
    BarChart as BarChartIcon,
    LineChart as LineChartIcon 
} from "lucide-react";

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
        const iconProps = {
            size: 18,
            className: "text-foreground opacity-80"
        };
        
        const icons = {
            Incoming: <MoveDown {...iconProps} />,
            Received: <Inbox {...iconProps} />,
            Outgoing: <Send {...iconProps} />,
            Completed: <CheckCircle2 {...iconProps} />,
            For_dispatch: <Package {...iconProps} />
        };
        return icons[status as keyof typeof icons] || null;
    }

    const isDark = theme === 'dark';

    const chartTypes = [
        { value: "Pie Chart", icon: PieChartIcon },
        { value: "Bar Chart", icon: BarChartIcon },
        { value: "Line Chart", icon: LineChartIcon }
    ];
    return (
        <div className="w-full rounded-lg relative bg-card">
            <div className="absolute top-2 right-2 z-10">
                <div className="relative inline-block">
                    <select
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                        className="appearance-none px-3 py-1.5 pr-8 rounded-lg bg-background 
                                 text-foreground border border-border hover:bg-accent
                                 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                                 transition-colors duration-200"
                    >
                        {chartTypes.map(type => (
                            <option key={type.value} value={type.value}>
                                {type.value}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                        {React.createElement(
                            chartTypes.find(t => t.value === chartType)?.icon || PieChartIcon,
                            { size: 16, className: "text-foreground opacity-70" }
                        )}
                    </div>
                </div>
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
                                                filter: isClickedOutside ? "brightness(1.1)" : "none",
                                                transition: "filter 0.3s ease-in-out",
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
                                        border: '1px solid hsl(var(--border))',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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

            <div className="flex flex-wrap justify-center gap-6 mt-6 pb-4">
                {data.map((entry, index) => (
                    <div 
                        key={index} 
                        className="flex items-center gap-3 text-sm bg-background/50 
                                 px-3 py-1.5 rounded-lg transition-colors duration-200 
                                 hover:bg-accent cursor-pointer"
                    >
                        <div className="flex items-center gap-2">
                            {getStatusIcon(entry.name)}
                            <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                        </div>
                        <span className="text-foreground font-medium">
                            {entry.percentage}%
                        </span>
                        <span className="text-muted-foreground">
                            {entry.name.replace(/_/g, ' ')}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}