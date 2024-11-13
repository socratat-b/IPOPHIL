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
import { doc_status } from "@/lib/dms/data"

interface DocumentCounts {
  dispatch: number
  intransit: number
  completed: number
  // mar-note: removed this canceled: number, because it is not used in the sidebar
  received: number
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
        console.error("Error fetching documents:", error)
        setDocuments([])
      }
    }
    fetchDocuments()
  }, [])

  const documentCounts = useMemo(() => {
    // Initialize counts for all statuses
    const counts = doc_status.reduce(
      (acc, status) => ({
        ...acc,
        [status.value]: 0,
      }),
      { received: 0, dispatch: 0, intransit: 0, completed: 0 } as DocumentCounts
    );

    // Loop through documents to count only "not viewed" documents
    documents.forEach((doc) => {
      if (!doc.date_viewed) {  // Only consider documents that haven't been viewed
        const status = doc.status.toLowerCase();
        const matchedStatus = doc_status.find(
          (s) => s.value.toLowerCase() === status
        );

        if (matchedStatus) {
          counts[matchedStatus.value as keyof DocumentCounts]++;
        }

        // If the document is marked as received, increment the received count
        if (doc.is_received) {
          counts.received++;
        }
      }
    });

    // The total count is the sum of all individual status counts
    counts.total = counts.dispatch + counts.intransit + counts.completed + counts.received;

    return counts;
  }, [documents]);

  // Transform and filter main navigation items
  const visibleMainNav = useMemo<NavMainItem[]>(() => {
    return navigationConfig.mainNav
      .filter((item) => visibleMainItems.includes(item.id))
      .map((item) => {
        const transformed = transformToMainNavItem(item);

        if (item.id === "documents") {
          transformed.notViewedCount = documentCounts.total;

          if (transformed.items) {
            transformed.items = item.items
              ?.filter((subItem) => visibleSubItems[item.id]?.includes(subItem.id))
              .map((subItem) => {
                const updatedSubItem = {
                  title: subItem.title,
                  url: subItem.url,
                  notViewedCount: documentCounts[subItem.id as keyof DocumentCounts] || 0,
                };

                return updatedSubItem;
              });
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