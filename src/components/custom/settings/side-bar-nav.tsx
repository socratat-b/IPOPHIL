'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { User, Settings, Palette, Bell, Monitor } from 'lucide-react'

const icons = {
  Profile: User,
  Account: Settings,
  Appearance: Palette,
  Notifications: Bell,
  Display: Monitor,
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    items: {
        href: string
        title: string
    }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
    const pathname = usePathname()

    return (
        <nav
            className={cn(
                'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
                className
            )}
            {...props}
        >
            {items.map((item) => {
                const Icon = icons[item.title as keyof typeof icons]
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            buttonVariants({ variant: 'ghost' }),
                            pathname === item.href
                                ? 'bg-primary/10 text-primary hover:bg-primary/20'
                                : 'hover:bg-muted hover:text-foreground',
                            'justify-start gap-3'
                        )}
                    >
                        {Icon && <Icon className="h-4 w-4" />}
                        {item.title}
                    </Link>
                )}
            )}
        </nav>
    )
}