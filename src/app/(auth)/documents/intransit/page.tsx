import { promises as fs } from "fs"
import path from "path"
import { Metadata } from "next"
import { z } from "zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/custom/dashboard/header"
import { documentsSchema } from "@/lib/faker/documents/schema"
import { columns } from "@/components/custom/incoming-documents/columns"
import { DataTable } from "@/components/custom/incoming-documents/data-table"

export const metadata: Metadata = {
    title: "DMS | Incoming Documents",
    description: "IPOPHIL Incoming Documents",
};

async function getTasks() {
    const data = await fs.readFile(
        path.join(process.cwd(), "src/lib/faker/documents/documents.json")
    )

    const tasks = JSON.parse(data.toString())

    return z.array(documentsSchema).parse(tasks)
}

export default async function TaskPage() {
    const allTasks = await getTasks()

    // Filter tasks for each tab
    const outgoingTasks = allTasks.filter(task => task.status === "outgoing")
    const receivedTasks = allTasks.filter(task => task.status === "received")

    return (
        <>
            <DashboardHeader
                breadcrumbs={[
                    { label: "Documents", href: "/documents" },
                    { label: "Intransit", active: true },
                ]}
            />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <Tabs defaultValue="outgoing" className="flex-1 flex flex-col">
                    <TabsList className="grid grid-cols-2 w-max">
                        <TabsTrigger value="outgoing">Outgoing Documents</TabsTrigger>
                        <TabsTrigger value="received">Received Documents</TabsTrigger>
                    </TabsList>
                    <TabsContent value="outgoing" className="mt-4">
                        <DataTable
                            data={outgoingTasks}
                            columns={columns}
                            selection={false}
                        />
                    </TabsContent>
                    <TabsContent value="received" className="mt-4">
                        <DataTable
                            data={receivedTasks}
                            columns={columns}
                            selection={false}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}