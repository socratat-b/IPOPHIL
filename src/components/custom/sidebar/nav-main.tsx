"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type LucideIcon } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    notViewedCount?: number
    items?: {
      title: string
      url: string
      notViewedCount?: number
    }[]
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasActiveSubItem = item.items?.some(subItem => pathname === subItem.url)
          const isActive = pathname === item.url

          return (
            <Collapsible
              key={item.title}
              defaultOpen={hasActiveSubItem}
            >
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={`
                    transition-all duration-150 ease-in-out
                    hover:bg-accent/50 active:scale-[0.98]
                    ${isActive ? 'bg-accent/80 text-accent-foreground font-medium' : ''}
                  `}
                >
                  <Link
                    href={item.url}
                    className="flex items-center gap-2"
                  >
                    <item.icon className={`
                      w-4 h-4 transition-colors duration-150
                      ${isActive ? 'text-accent-foreground' : 'text-muted-foreground'}
                    `} />
                    <span>{item.title}</span>
                    {item.title === "Documents" && item.notViewedCount && (
                      <Badge variant={"default"} className="text-xs px-1.5 py-0.5">{item.notViewedCount}</Badge>
                    )}
                  </Link>
                </SidebarMenuButton>

                {item.items?.length && (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction
                        className={`
                          data-[state=open]:rotate-90 
                          transition-transform duration-150 ease-in-out
                          hover:bg-accent/30 active:scale-[0.98]
                          ${hasActiveSubItem ? 'text-accent-foreground' : 'text-muted-foreground'}
                        `}
                      >
                        <Icons.chevronRight className="w-4 h-4" />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="transition-all duration-200 ease-in-out">
                      <SidebarMenuSub>
                        {item.items.map((subItem) => {
                          const isSubActive = pathname === subItem.url;
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                className={`
                                  transition-all duration-150 ease-in-out
                                  hover:bg-accent/50 active:scale-[0.98]
                                  ${isSubActive ? 'bg-accent/80 text-accent-foreground font-medium' : ''}
                                `}
                              >
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                  {item.title === "Documents" && subItem.notViewedCount && (
                                    <Badge variant={"destructive"} className="text-xs px-1.5 py-0.5">{subItem.notViewedCount}</Badge>
                                  )}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                )}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
