
import { promises as fs } from "fs"
import path from "path"
import { Metadata } from "next"
import { z } from "zod"
import { DashboardHeader } from "@/components/custom/dashboard/header"
import { documentsSchema } from "@/lib/faker/documents/schema"
import { DataTable } from "@/components/custom/documents/data-table"
import { columns } from "@/components/custom/documents/columns"

export const metadata: Metadata = {
    title: "DMS | Documents",
    description: "IPOPHIL Documents",
};

async function getTasks() {
    const data = await fs.readFile(
        path.join(process.cwd(), "src/lib/faker/documents/documents.json")
    )

    const tasks = JSON.parse(data.toString())

    return z.array(documentsSchema).parse(tasks)
}

export default async function TaskPage() {
    const tasks = await getTasks()

    return (
        <>
            <DashboardHeader
                breadcrumbs={[
                    { label: "Documents", href: "/documents", active: true },
                ]}
            />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <DataTable
                    data={tasks}
                    columns={columns}
                    selection={true}
                />
            </div>
        </>
    )
}