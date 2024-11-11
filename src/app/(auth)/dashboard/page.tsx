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
import { motion } from "framer-motion"

// Subtle fade-in animation for initial page load
const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
}

// Subtle stagger effect for cards
const containerVariants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
}

const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.3 }
    }
}

// Sample data remains the same
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
// ... rest of the sample data remains unchanged

const StatCard = ({ title, value, percentage, icon: Icon, data }: any) => (
    <motion.div variants={itemVariants}>
        <Card className="transition-all duration-200 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">
                    {percentage > 0 ? '+' : ''}{percentage}% from last month
                </p>
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
            </CardContent>
        </Card>
    </motion.div>
)

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
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.4 }}
        >
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
                                <AddDocumentButton title="Receive" actionType="Receive" />
                                <AddDocumentButton title="Release" actionType="Release" />
                                <AddDocumentButton title="Add Document" actionType="Create" />
                            </div>
                        </div>

                        <motion.div 
                            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
                            variants={containerVariants}
                            initial="initial"
                            animate="animate"
                        >
                            <StatCard
                                title="Total Incoming"
                                value={stats.current.incoming}
                                percentage={stats.percentageChanges.incoming}
                                icon={Icons.incoming}
                                data={incomingData}
                            />
                            <StatCard
                                title="Total Received"
                                value={stats.current.recieved}
                                percentage={stats.percentageChanges.recieved}
                                icon={Icons.recieved}
                                data={receivedData}
                            />
                            <StatCard
                                title="Total Outgoing"
                                value={stats.current.outgoing}
                                percentage={stats.percentageChanges.outgoing}
                                icon={Icons.outgoing}
                                data={outgoingData}
                            />
                            <StatCard
                                title="Total Completed"
                                value={stats.current.completed}
                                percentage={stats.percentageChanges.completed}
                                icon={Icons.completed}
                                data={completedData}
                            />
                        </motion.div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <div className="col-span-4">
                                <Card className="transition-all duration-200 hover:shadow-md">
                                    <CardHeader>
                                        <CardTitle>Document Status</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pl-2">
                                        <Overview documents={documents} />
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="col-span-3">
                                <Card className="transition-all duration-200 hover:shadow-md">
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
            </div>
        </motion.div>
    )
}