"use client";

import React from "react"
import RecentDocuments from "@/components/custom/dashboard/recent-documents";
import { DashboardHeader } from "@/components/custom/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/custom/dashboard/overview";
import { Icons } from "@/components/ui/icons";
import { useDocuments } from "@/lib/context/document-context";
import { ComponentType, useMemo } from "react";
import { Stats, StatusCounts } from "@/lib/types";
import { AddDocumentButton } from "@/components/custom/common/add-document-button";
import { LineChart, Line } from 'recharts';
import { Document } from "@/lib/faker/documents/schema";

const isWeekday = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 5; 
};

const getStatusCountsByDate = (documents: Document[], status: string, date: string) => {
    return documents.filter(doc => 
        doc.status === status && 
        new Date(doc.date_created).toISOString().split('T')[0] === date
    ).length;
};

const getLast7WeekdayStats = (documents: Document[], status: string) => {
    const stats = [];
    let currentDate = new Date();
    let count = 0;

    while (count < 7) {
        if (isWeekday(currentDate)) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const value = getStatusCountsByDate(documents, status, dateStr);
            stats.unshift({ value });
            count++;
        }
        currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return stats;
};

const SparklineChart = ({ data }: { data: Array<{ value: number }> }) => {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className="h-[40px]" />;
    }

    return (
        <div className="h-[40px] mt-3">
            <LineChart data={data} width={200} height={40}>
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 2, fill: "#fff" }}
                />
            </LineChart>
        </div>
    );
};

const StatCard = ({
    title,
    icon: Icon,
    count,
    change,
    data
}: {
    title: string;
    icon: ComponentType<{ className?: string }>;
    count: number;
    change: number;
    data: Array<{ value: number }>;
}) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{count}</div>
            <p className="text-xs text-muted-foreground">
                {change > 0 ? '+' : ''}{change}% from last month
            </p>
            <SparklineChart data={data} />
        </CardContent>
    </Card>
);

export default function Page() {
    const { documents } = useDocuments();

    const stats = useMemo<Stats>(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const currentCounts: StatusCounts = {
            incoming: 0,
            recieved: 0,
            outgoing: 0,
            forDispatch: 0,
            completed: 0,
        };

        const lastMonthCounts: StatusCounts = {
            incoming: 0,
            recieved: 0,
            outgoing: 0,
            forDispatch: 0,
            completed: 0,
        };

        documents.forEach(doc => {
            const docDate = new Date(doc.date_created);
            const docMonth = docDate.getMonth();
            const docYear = docDate.getFullYear();

            const counts = (docMonth === currentMonth && docYear === currentYear)
                ? currentCounts
                : (docMonth === (currentMonth - 1 + 12) % 12 &&
                    (docMonth === 11 ? docYear === currentYear - 1 : docYear === currentYear))
                    ? lastMonthCounts
                    : null;

            if (counts) {
                const status = doc.status.toLowerCase();
                switch (status) {
                    case 'incoming':
                        counts.incoming++;
                        break;
                    case 'recieved':
                        counts.recieved++;
                        break;
                    case 'outgoing':
                        counts.outgoing++;
                        break;
                    case 'for_dispatch':
                        counts.forDispatch++;
                        break;
                    case 'completed':
                        counts.completed++;
                        break;
                }
            }
        });

        const getPercentageChange = (current: number, previous: number): number => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Number(((current - previous) / previous * 100).toFixed(1));
        };

        return {
            current: currentCounts,
            percentageChanges: {
                incoming: getPercentageChange(currentCounts.incoming, lastMonthCounts.incoming),
                recieved: getPercentageChange(currentCounts.recieved, lastMonthCounts.recieved),
                outgoing: getPercentageChange(currentCounts.outgoing, lastMonthCounts.outgoing),
                completed: getPercentageChange(currentCounts.completed, lastMonthCounts.completed),
            },
        };
    }, [documents]);

    const chartData = useMemo(() => ({
        incoming: getLast7WeekdayStats(documents, 'incoming'),
        received: getLast7WeekdayStats(documents, 'recieved'),
        outgoing: getLast7WeekdayStats(documents, 'outgoing'),
        completed: getLast7WeekdayStats(documents, 'completed'),
    }), [documents]);

    const recentDocs = useMemo(() => {
        return [...documents]
            .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
            .slice(0, 5);
    }, [documents]);

    return (
        <>
            <DashboardHeader />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="hidden flex-col md:flex">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between space-y-2">
                            <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
                            <div className="flex items-center space-x-2">
                                <AddDocumentButton title="Receive" actionType="Receive" variant="outline" />
                                <AddDocumentButton title="Release" actionType="Release" variant="destructive" />
                                <AddDocumentButton title="Add Document" actionType="Create" variant="default" />
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <StatCard
                                title="Total Incoming"
                                icon={Icons.incoming}
                                count={stats.current.incoming}
                                change={stats.percentageChanges.incoming}
                                data={chartData.incoming}
                            />
                            <StatCard
                                title="Total Received"
                                icon={Icons.recieved}
                                count={stats.current.recieved}
                                change={stats.percentageChanges.recieved}
                                data={chartData.received}
                            />
                            <StatCard
                                title="Total Outgoing"
                                icon={Icons.outgoing}
                                count={stats.current.outgoing}
                                change={stats.percentageChanges.outgoing}
                                data={chartData.outgoing}
                            />
                            <StatCard
                                title="Total Completed"
                                icon={Icons.completed}
                                count={stats.current.completed}
                                change={stats.percentageChanges.completed}
                                data={chartData.completed}
                            />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <Card className="col-span-4">
                                <CardContent className="pl-2">
                                    <Overview documents={documents} />
                                </CardContent>
                            </Card>
                            <Card className="col-span-3">
                                <CardHeader>
                                    <CardTitle>My Recent Documents</CardTitle>
                                    <CardDescription>
                                        You have {documents.length} documents total.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <RecentDocuments documents={recentDocs} />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}