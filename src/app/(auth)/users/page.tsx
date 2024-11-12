// src/app/(auth)/users/page.tsx
import { Metadata } from "next"
import { getUsers } from '@/lib/services/users'
import { DashboardHeader } from "@/components/custom/dashboard/header"
import { DataTable } from "@/components/custom/users/data-table"
import { columns } from "@/components/custom/users/columns"

export const metadata: Metadata = {
    title: "DMS | Users",
    description: "IPOPHIL Users",
}

export default async function UserPage() {
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