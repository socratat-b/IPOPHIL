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
import { Line, LineChart} from "recharts"
import { Calendar } from "@/components/ui/calendar"

// Sample data for the sparkline charts
const incomingData = [
    { value: 10 },
    { value: 15 },
    { value: 12 },
    { value: 18 },
    { value: 15 },
    { value: 21 },
    { value: 25 },
]

const receivedData = [
    { value: 8 },
    { value: 12 },
    { value: 15 },
    { value: 18 },
    { value: 20 },
    { value: 21 },
]

const outgoingData = [
    { value: 5 },
    { value: 8 },
    { value: 6 },
    { value: 9 },
    { value: 7 },
    { value: 8 },
]

const completedData = [
    { value: 4 },
    { value: 6 },
    { value: 8 },
    { value: 7 },
    { value: 9 },
    { value: 9 },
]
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
            <div className="flex items-center justify-between p-4">
                <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
                <div className="flex items-center space-x-2">
                    <AddDocumentButton title={"Receive"} actionType={"Receive"} />
                    <AddDocumentButton title={"Release"} actionType={"Release"} />
                    <AddDocumentButton title={"Add Document"} actionType={"Create"} />
                </div>
            </div>
            
                
            <div className="flex flex-row w-full h-screen gap-5 p-4">  
                <div className="w-2/3 flex flex-col gap-5">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Incoming
                                </CardTitle>
                                <Icons.incoming className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="">
                                <div className="text-3xl font-bold">{stats.current.incoming}</div>
                                <p className="text-xs text-muted-foreground">
                                    {formatPercentage(stats.percentageChanges.incoming)} from last month
                                </p>
                                <div className="h-[30px] mt-3 flex justify-center">
                                    <LineChart data={incomingData} width={150} height={50}>
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth={2}
                                            dot={{ r: 2, fill: "#fff" }}
                                        />
                                    </LineChart>
                                </div>
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
                                <div className="text-3xl font-bold">{stats.current.recieved}</div>
                                <p className="text-xs text-muted-foreground">
                                    {formatPercentage(stats.percentageChanges.recieved)} from last month
                                </p>
                                <div className="h-[30px] mt-3 flex justify-center">
                                    <LineChart data={receivedData} width={150} height={50}>
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth={2}
                                            dot={{ r: 2, fill: "#fff" }}
                                        />
                                    </LineChart>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Outgoing</CardTitle>
                                <Icons.outgoing className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats.current.outgoing}</div>
                                <p className="text-xs text-muted-foreground">
                                    {formatPercentage(stats.percentageChanges.outgoing)} from last month
                                </p>
                                <div className="h-[30px] mt-3 flex justify-center">
                                    <LineChart data={outgoingData} width={150} height={50}>
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth={2}
                                            dot={{ r: 2, fill: "#fff" }}
                                        />
                                    </LineChart>
                                </div>
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
                                <div className="text-3xl font-bold">{stats.current.completed}</div>
                                <p className="text-xs text-muted-foreground">
                                    {formatPercentage(stats.percentageChanges.completed)} from last month
                                </p>
                                <div className="h-[30px] mt-3 flex justify-center">
                                    <LineChart data={completedData} width={150} height={50}>
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth={2}
                                            dot={{ r: 2, fill: "#fff" }}
                                        />
                                    </LineChart>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <Card className="col-span-4 h-2/3">
                        <CardHeader>
                            <CardTitle>Document Status</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <Overview documents={documents} />
                        </CardContent>
                    </Card>
                </div>
                
                <div className="flex flex-col w-1/3 h-screen gap-5">
                    
                    <Card className="col-span-3 h-[50%] overflow-y-auto">
                        <CardHeader>
                            <CardTitle>My Recent Documents</CardTitle>
                            <CardDescription>
                                You have {documents.length} documents total.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Display all documents, but hide overflow */}
                            <RecentDocuments documents={recentDocs} />
                        </CardContent>
                    </Card>

                    <Card className="flex flex-1 justify-center items-center mb-12">
                        <Calendar></Calendar>
                    </Card>
                    
                </div>

            </div>
                
            
        </>
    )
}