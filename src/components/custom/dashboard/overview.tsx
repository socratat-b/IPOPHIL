"use client";

import React, { useEffect, useRef, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Document } from "@/lib/faker/documents/schema";

interface OverviewProps {
    documents: Document[]
}

export function Overview({ documents }: OverviewProps) {
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
                setTimeout(() => setIsClickedOutside(false), 300); // Reset after animation
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
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
        percentage: number; name: string; value: number; color: string 
    }>);

    const total = documents.length;
    data.forEach(item => {
        item.percentage = Number(((item.value / total) * 100).toFixed(1));
    });

    function getStatusColor(status: string) {
        const colors = {
            Incoming: '#E879F9',
            Received: '#93C5FD',
            Outgoing: '#FB923C',
            Completed: '#4ADE80',
            For_dispatch: '#A78BFA'
        };
        return colors[status as keyof typeof colors] || '#CBD5E1';
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

    return (
        <div className="w-full bg-white p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-700">
                    Total Documents: <span className="font-extrabold text-black">{total}</span>
                </span>
            </div>

            <div ref={containerRef} className="relative h-[350px] flex justify-center items-center">
                {chartWidth > 0 && chartHeight > 0 && (
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
                            contentStyle={{ borderRadius: '8px', padding: '10px', fontSize: '0.9rem' }}
                            labelStyle={{ fontWeight: 'bold' }}
                        />
                    </PieChart>
                )}
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-6 text-gray-600">
                {data.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-1">
                            <span className="text-lg">{getStatusIcon(entry.name)}</span>
                            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        </div>
                        <span className="text-gray-800 font-semibold">{entry.percentage}%</span>
                        <span>{entry.name.replace(/_/g, ' ')}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
