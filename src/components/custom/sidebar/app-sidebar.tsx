"use client"

import { NavMain } from "@/components/custom/sidebar/nav-main"
import { NavUser } from "@/components/custom/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { NavSecondary } from "./nav-secondary"
import { Icons } from "@/components/ui/icons"
import { useMemo } from "react"
import { useDocuments } from "@/lib/context/document-context"
import { ComponentProps } from "react"

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { documents } = useDocuments()

  const documentCounts = useMemo(() => {
    const counts = {
      incoming: 0,
      received: 0,
      outgoing: 0,
      forDispatch: 0,
      completed: 0,
      total: 0
    };

    documents.forEach(doc => {
      if (!doc.date_viewed) {
        switch (doc.status.toLowerCase()) {
          case 'incoming':
            counts.incoming++;
            counts.total++;
            break;
          case 'recieved':
            counts.received++;
            counts.total++;
            break;
          case 'outgoing':
            counts.outgoing++;
            counts.total++;
            break;
          case 'for_dispatch':
            counts.forDispatch++;
            counts.total++;
            break;
          case 'completed':
            counts.completed++;
            counts.total++;
            break;
        }
      }
    });

    return counts;
  }, [documents]);

  const data = {
    user: {
      name: "user",
      email: "user@gmail.com",
      avatar: "/images/user-random-1.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Icons.layoutDashboard,
      },
      {
        title: "Documents",
        url: "/documents",
        icon: Icons.building,
        isActive: false,
        notViewedCount: documentCounts.total - documentCounts.completed,
        items: [
          {
            title: "For Dispatch",
            url: "/documents/dispatch",
            notViewedCount: documentCounts.forDispatch,
          },
          {
            title: "Intransit",
            url: "/documents/intransit",
            notViewedCount: documentCounts.received,
          },
          {
            title: "Received",
            url: "/documents/recieved",
            notViewedCount: documentCounts.received,
          },
          {
            title: "Completed",
            url: "/completed",
            icon: Icons.leafyGreen,
            notViewedCount: documentCounts.completed,
          },
        ],
      },
      {
        title: "Management",
        url: "/users",
        icon: Icons.settings,
        items: [
          {
            title: "Users",
            url: "/users",
            icon: Icons.user2,
          },
          {
            title: "Type",
            url: "/documents/intransit",
          },
        ],
      },
      {
        title: "Reports",
        url: "/reports",
        icon: Icons.printer,
      },
    ],
    navSecondary: [
      {
        title: "Customer Support",
        url: "#",
        icon: Icons.lifeBuoy,
      },
      {
        title: "Send Feedback",
        url: "#",
        icon: Icons.send,
      },
    ],

  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  <Image src="/logo.svg" alt="Logo" width={32} height={32} />
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
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}