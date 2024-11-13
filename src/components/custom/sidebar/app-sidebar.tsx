"use client"

import { ComponentProps, useMemo, useEffect, useState } from "react"
import Image from "next/image"
import { useNavigationStore } from "@/lib/stores/navigation"
import { navigationConfig, transformToMainNavItem, transformToSecondaryNavItem } from "@/lib/config/navigation"
import { NavMainItem, NavSecondaryItem } from "@/lib/types/navigation"
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
import type { JoinedDocument } from "@/lib/dms/joined-docs"
import { getJoinedDocuments } from "@/lib/services/joined-documents"

type DocumentStatus = 'incoming' | 'recieved' | 'outgoing' | 'for_dispatch' | 'completed'

interface DocumentCounts {
  incoming: number
  received: number
  outgoing: number
  forDispatch: number
  completed: number
  total: number
}

type AppSidebarProps = ComponentProps<typeof Sidebar>

export function AppSidebar({ ...props }: AppSidebarProps) {
  const [documents, setDocuments] = useState<JoinedDocument[]>([])
  const {
    visibleMainItems,
    visibleSecondaryItems,
    visibleSubItems,
    showUserSection
  } = useNavigationStore()

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const docs = await getJoinedDocuments()
        setDocuments(docs)
      } catch (error) {
        console.error('Error fetching documents:', error)
        setDocuments([])
      }
    }
    fetchDocuments()
  }, [])

  const documentCounts = useMemo(() => {
    const counts: DocumentCounts = {
      incoming: 0,
      received: 0,
      outgoing: 0,
      forDispatch: 0,
      completed: 0,
      total: 0
    }

    documents.forEach((doc) => {
      if (!doc.date_viewed) {
        const status = doc.status.toLowerCase() as DocumentStatus
        switch (status) {
          case 'incoming':
            counts.incoming++
            counts.total++
            break
          case 'recieved':
            counts.received++
            counts.total++
            break
          case 'outgoing':
            counts.outgoing++
            counts.total++
            break
          case 'for_dispatch':
            counts.forDispatch++
            counts.total++
            break
          case 'completed':
            counts.completed++
            counts.total++
            break
        }
      }
    })

    return counts
  }, [documents])

  // Transform and filter main navigation items
  const visibleMainNav = useMemo<NavMainItem[]>(() => {
    return navigationConfig.mainNav
      .filter(item => visibleMainItems.includes(item.id))
      .map(item => {
        const transformed = transformToMainNavItem(item)

        if (item.id === 'documents') {
          transformed.notViewedCount = documentCounts.total - documentCounts.completed
          
          if (transformed.items) {
            transformed.items = item.items
              ?.filter(subItem => visibleSubItems[item.id]?.includes(subItem.id))
              .map(subItem => {
                const updatedSubItem = {
                  title: subItem.title,
                  url: subItem.url,
                  notViewedCount: 0
                }

                // Map counts based on the original subItem.id
                switch (subItem.id) {
                  case 'dispatch':
                    updatedSubItem.notViewedCount = documentCounts.forDispatch
                    break
                  case 'intransit':
                    updatedSubItem.notViewedCount = documentCounts.outgoing
                    break
                  case 'received':
                    updatedSubItem.notViewedCount = documentCounts.received
                    break
                  case 'completed':
                    updatedSubItem.notViewedCount = documentCounts.completed
                    break
                }

                return updatedSubItem
              })
          }
        }

        if (item.id === 'management' && transformed.items) {
          transformed.items = item.items
            ?.filter(subItem => visibleSubItems[item.id]?.includes(subItem.id))
            .map(subItem => ({
              title: subItem.title,
              url: subItem.url
            }))
        }

        return transformed
      })
  }, [visibleMainItems, visibleSubItems, documentCounts])

  // Transform and filter secondary navigation items
  const visibleSecondaryNav = useMemo<NavSecondaryItem[]>(() => {
    return navigationConfig.secondaryNav
      .filter(item => visibleSecondaryItems.includes(item.id))
      .map(transformToSecondaryNavItem)
  }, [visibleSecondaryItems])

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image
                    src="/logo.svg"
                    alt="Logo"
                    width={32}
                    height={32}
                    priority
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">IPHOPHIL</span>
                  <span className="truncate text-xs">DMS</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={visibleMainNav} />
        <NavSecondary items={visibleSecondaryNav} className="mt-auto" />
      </SidebarContent>

      {showUserSection && (
        <SidebarFooter>
          <NavUser
            user={{
              name: "user",
              email: "user@gmail.com",
              avatar: "/images/user-random-1.jpg",
            }}
          />
        </SidebarFooter>
      )}
    </Sidebar>
  )
}