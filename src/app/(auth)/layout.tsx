// src/app/(auth)/layout.tsx
"use client"

import { AppSidebar } from "@/components/custom/sidebar/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { Document } from "@/lib/faker/documents/schema"
import { useState, useEffect } from "react"
import { documentsSchema } from "@/lib/faker/documents/schema"
import { DocumentContext } from "@/lib/context/document-context"

type ChildrenProps = {
    children: React.ReactNode;
}

const AuthLayoutContent = ({ children }: ChildrenProps) => {
    const [documents, setDocuments] = useState<Document[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const docResponse = await fetch('/api/documents');
                const docData = await docResponse.json();
                setDocuments(documentsSchema.array().parse(docData));
            } catch (error) {
                console.error('Error fetching documents:', error);
                setDocuments([]);
            }
        }
        fetchData();
    }, []);

    return (
        <DocumentContext.Provider value={{ documents }}>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <main className="flex-1">
                        {children}
                    </main>
                </SidebarInset>
                <Toaster richColors position="bottom-right" />
            </SidebarProvider>
        </DocumentContext.Provider>
    );
};

export default function AuthLayout({ children }: ChildrenProps) {
    return <AuthLayoutContent>{children}</AuthLayoutContent>;
}