// src\app\(auth)\users\page.tsx
import { promises as fs } from "fs"
import path from "path"
import { Metadata } from "next"
import { z } from "zod"
import { DashboardHeader } from "@/components/custom/dashboard/header"
import { userSchema } from "@/lib/faker/users/schema"
import { DataTable } from "@/components/custom/users/data-table"
import { columns } from "@/components/custom/users/columns"

export const metadata: Metadata = {
    title: "DMS | Users",
    description: "IPOPHIL Users",
};

async function getUsers() {
    const data = await fs.readFile(
        path.join(process.cwd(), "src/lib/faker/users/users.json")
    )

    const tasks = JSON.parse(data.toString())

    return z.array(userSchema).parse(tasks)
}

export default async function TaskPage() {
    const users = await getUsers()

    return (
        <>
            <DashboardHeader
                breadcrumbs={[
                    { label: "Users", href: "/users", active: true },
                ]}
            />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <DataTable
                    data={users}
                    columns={columns}
                    selection={false}
                />
            </div>
        </>
    )
}