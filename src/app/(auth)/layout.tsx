// src/app/(auth)/layout.tsx
"use client"

import { AppSidebar } from "@/components/custom/sidebar/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"

type ChildrenProps = {
    children: React.ReactNode;
}

const AuthLayoutContent = ({ children }: ChildrenProps) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <main className="flex-1">
                    {children}
                </main>
            </SidebarInset>
            <Toaster richColors position="bottom-right" />
        </SidebarProvider>
    );
};

export default function AuthLayout({ children }: ChildrenProps) {
    return <AuthLayoutContent>{children}</AuthLayoutContent>;
}