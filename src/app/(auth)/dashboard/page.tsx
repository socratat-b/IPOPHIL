"use client"

import { DashboardHeader } from "@/components/custom/dashboard/header"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Overview } from "@/components/custom/dashboard/overview"
import { Icons } from "@/components/ui/icons"
import RecentDocuments from "@/components/custom/dashboard/recent-documents"
import { useDocuments } from "@/lib/context/document-context"
import { useMemo } from "react"
import { Stats, StatusCounts } from "@/lib/types"
import { AddDocumentButton } from "@/components/custom/common/add-document-button"

export default function Page() {
    const { documents } = useDocuments()

    // Calculate document statistics with useMemo to avoid unnecessary recalculations
    const stats = useMemo<Stats>(() => {
        const lastMonth = new Date()
        lastMonth.setMonth(lastMonth.getMonth() - 1)

        const currentCounts: StatusCounts = {
            incoming: 0,
            recieved: 0,
            outgoing: 0,
            forDispatch: 0,
            completed: 0
        }

        const lastMonthCounts: StatusCounts = {
            incoming: 0,
            recieved: 0,
            outgoing: 0,
            forDispatch: 0,
            completed: 0
        }

        documents.forEach(doc => {
            const docDate = new Date(doc.date_created)
            const counts = docDate > lastMonth ? currentCounts : lastMonthCounts

            switch (doc.status.toLowerCase()) {
                case 'incoming':
                    counts.incoming++
                    break
                case 'recieved':
                    counts.recieved++
                    break
                case 'outgoing':
                    counts.outgoing++
                    break
                case 'for_dispatch':
                    counts.forDispatch++
                    break
                case 'completed':
                    counts.completed++
                    break
            }
        })

        // Calculate percentage changes
        const getPercentageChange = (current: number, previous: number): number => {
            if (previous === 0) return current > 0 ? 100 : 0
            return Number(((current - previous) / previous * 100).toFixed(1))
        }

        return {
            current: currentCounts,
            percentageChanges: {
                incoming: getPercentageChange(currentCounts.incoming, lastMonthCounts.incoming),
                recieved: getPercentageChange(currentCounts.recieved, lastMonthCounts.recieved),
                outgoing: getPercentageChange(currentCounts.outgoing, lastMonthCounts.outgoing),
                completed: getPercentageChange(currentCounts.completed, lastMonthCounts.completed)
            }
        }
    }, [documents])

    // Get recent documents (last 4)
    const recentDocs = useMemo(() => {
        return [...documents]
            .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
            .slice(0, 4)
    }, [documents])

    const formatPercentage = (value: number) => {
        return `${value > 0 ? '+' : ''}${value}%`
    }

    return (
        <>
            <DashboardHeader
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard", active: true },
                ]}
            />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="hidden flex-col md:flex">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between space-y-2">
                            <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
                            <div className="flex items-center space-x-2">
                                <AddDocumentButton title={"Receive"} actionType={"Receive"} />
                                <AddDocumentButton title={"Release"} actionType={"Release"} />
                                <AddDocumentButton title={"Add Document"} actionType={"Create"} />
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Incoming
                                    </CardTitle>
                                    <Icons.incoming className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.current.incoming}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {formatPercentage(stats.percentageChanges.incoming)} from last month
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Received
                                    </CardTitle>
                                    <Icons.recieved className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.current.recieved}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {formatPercentage(stats.percentageChanges.recieved)} from last month
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Outgoing</CardTitle>
                                    <Icons.outgoing className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.current.outgoing}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {formatPercentage(stats.percentageChanges.outgoing)} from last month
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Completed
                                    </CardTitle>
                                    <Icons.completed className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.current.completed}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {formatPercentage(stats.percentageChanges.completed)} from last month
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <Card className="col-span-4">
                                <CardHeader>
                                    <CardTitle>Document Status</CardTitle>
                                </CardHeader>
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
    )
}