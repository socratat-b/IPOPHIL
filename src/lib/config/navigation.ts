// src/lib/config/navigation.ts
import { Icons } from "@/components/ui/icons"
import type { LucideIcon } from "lucide-react"
import {
    type NavConfig,
    type NavMainItem,
    type NavSecondaryItem,
    type NavigationConfiguration,
    hasSubItems,
} from "@/lib/types/navigation"

// Helper function to transform config to main nav item
export function transformToMainNavItem(item: NavConfig): NavMainItem {
    const baseItem: NavMainItem = {
        title: item.title,
        url: item.url,
        notViewedCount: item.notViewedCount,
    }

    if (item.iconName && item.iconName in Icons) {
        baseItem.icon = Icons[item.iconName] as LucideIcon
    }

    if (hasSubItems(item)) {
        baseItem.items = item.items.map(subItem => ({
            title: subItem.title,
            url: subItem.url,
            notViewedCount: subItem.notViewedCount,
        }))
    }

    return baseItem
}

// Helper function to transform config to secondary nav item
export function transformToSecondaryNavItem(item: NavConfig): NavSecondaryItem {
    const baseItem: NavSecondaryItem = {
        title: item.title,
        url: item.url,
        notViewedCount: item.notViewedCount,
    }

    if (item.iconName && item.iconName in Icons) {
        baseItem.icon = Icons[item.iconName] as LucideIcon
    }

    return baseItem
}

export const navigationConfig: NavigationConfiguration = {
    mainNav: [
        {
            id: "dashboard",
            type: "main",
            title: "Dashboard",
            url: "/dashboard",
            iconName: "layoutDashboard",
        },
        {
            id: "documents",
            type: "main",
            title: "Documents",
            url: "/documents",
            iconName: "folder",
            items: [
                {
                    id: "dispatch",
                    title: "For Dispatch",
                    url: "/documents/intransit",
                },
                {
                    id: "intransit",
                    title: "Intransit",
                    url: "/documents/intransit",
                },
                {
                    id: "received",
                    title: "Received",
                    url: "/documents/intransit",
                },
                {
                    id: "completed",
                    title: "Completed",
                    url: "/documents/intransit",
                },
            ],
        },
        {
            id: "management",
            type: "main",
            title: "Management",
            url: "/users",
            iconName: "settings",
            items: [
                {
                    id: "users",
                    title: "Users",
                    url: "/users",
                },
                {
                    id: "types",
                    title: "Type",
                    url: "/documents/intransit",
                },
            ],
        },
        {
            id: "reports",
            type: "main",
            title: "Reports",
            url: "/reports",
            iconName: "fileText",
        },
    ],
    secondaryNav: [
        {
            id: "support",
            type: "secondary",
            title: "Customer Support",
            url: "/support",
            iconName: "helpCircle",
        },
        {
            id: "feedback",
            type: "secondary",
            title: "Send Feedback",
            url: "/feedback",
            iconName: "messageSquare",
        },
    ],
} as const