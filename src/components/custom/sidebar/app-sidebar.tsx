"use client"

import { ComponentProps, useMemo, useEffect, useState } from "react"
import Image from "next/image"
import { useNavigationStore } from "@/lib/stores/navigation"
import { navigationConfig, transformToMainNavItem, transformToSecondaryNavItem } from "@/lib/config/navigation"
import { NavMainItem, NavSecondaryItem } from "@/lib/types/navigation"
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { useRouter } from "next/navigation"
import { Icons } from "@/components/ui/icons"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { JoinedDocument } from "@/lib/dms/joined-docs"
import { getJoinedDocuments } from "@/lib/services/joined-documents"
import { doc_status } from "@/lib/dms/data"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface DocumentCounts {
  dispatch: number
  intransit: number
  completed: number
  received: number
  total: number
}

type AppSidebarProps = ComponentProps<typeof Sidebar>

export function AppSidebar({ ...props }: AppSidebarProps) {
  const [documents, setDocuments] = useState<JoinedDocument[]>([])
  const { visibleMainItems, visibleSecondaryItems, visibleSubItems, showUserSection } = useNavigationStore()
  const router = useRouter()
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)

  const openLogout = () => setIsLogoutOpen(true)
  const closeLogout = () => setIsLogoutOpen(false)

  const handleLogout = async () => {
    try {
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

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
    const counts = doc_status.reduce(
      (acc, status) => ({
        ...acc,
        [status.value]: 0,
      }),
      { received: 0, dispatch: 0, intransit: 0, completed: 0 } as DocumentCounts
    )

    documents.forEach((doc) => {
      if (!doc.date_viewed) {
        const status = doc.status.toLowerCase()
        const matchedStatus = doc_status.find((s) => s.value.toLowerCase() === status)

        if (matchedStatus) {
          counts[matchedStatus.value as keyof DocumentCounts]++
        }

        if (doc.is_received) {
          counts.received++
        }
      }
    })

    counts.total = counts.dispatch + counts.intransit + counts.completed + counts.received

    return counts
  }, [documents])

  const visibleMainNav = useMemo<NavMainItem[]>(() => {
    return navigationConfig.mainNav
      .filter((item) => visibleMainItems.includes(item.id))
      .map((item) => {
        const transformed = transformToMainNavItem(item)

        if (item.id === "documents") {
          transformed.notViewedCount = documentCounts.total

          if (transformed.items) {
            transformed.items = item.items
              ?.filter((subItem) => visibleSubItems[item.id]?.includes(subItem.id))
              .map((subItem) => ({
                title: subItem.title,
                url: subItem.url,
                notViewedCount: documentCounts[subItem.id as keyof DocumentCounts] || 0,
              }))
          }
        }

        if (item.id === "management" && transformed.items) {
          transformed.items = item.items
            ?.filter((subItem) => visibleSubItems[item.id]?.includes(subItem.id))
            .map((subItem) => ({
              title: subItem.title,
              url: subItem.url,
            }))
        }

        return transformed
      })
  }, [visibleMainItems, visibleSubItems, documentCounts])

  const visibleSecondaryNav = useMemo<NavSecondaryItem[]>(() => {
    return navigationConfig.secondaryNav
      .filter((item) => visibleSecondaryItems.includes(item.id))
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
                  <Image src="/logo.svg" alt="Logo" width={32} height={32} priority />
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

      {/* {showUserSection && (
        <SidebarFooter>
          <NavUser
            user={{
              name: "user",
              email: "user@gmail.com",
              avatar: "/images/user-random-1.jpg",
            }}
          />
        </SidebarFooter>
      )} */}

      <div onClick={openLogout} className="flex w-56 h-6 mb-2 hover:bg-sidebar-accent p-2 ml-2 rounded-md cursor-pointer">
        <button className="text-red-600 flex justify-start text-sm items-center dark:text-red-400">
          <Icons.logout className="mr-2 h-4 w-4" />
          Log out
        </button>
      </div>

      <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <DialogContent className="flex flex-col items-center justify-center text-center space-y-6 p-8 max-w-sm mx-auto rounded-lg">
          <DialogHeader className="flex flex-col items-center">
            <DialogTitle className="text-lg font-semibold">Confirm Logout</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Are you sure you want to log out?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center space-x-4 mt-4">
            <Button
              onClick={closeLogout}
              variant="outline"
              className="px-4 py-2 text-sm rounded-md"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-sm text-white rounded-md hover:bg-red-700"
            >
              Log out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  )
}
