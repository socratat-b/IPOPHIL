// src/lib/context/document-context.tsx
"use client"

import { Document } from "@/lib/faker/documents/schema"
import { createContext, useContext } from "react"

interface DocumentContextType {
    documents: Document[];
}

export const DocumentContext = createContext<DocumentContextType>({ documents: [] });

export const useDocuments = () => useContext(DocumentContext);