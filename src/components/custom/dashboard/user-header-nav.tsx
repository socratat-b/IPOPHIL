"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { Icons } from "@/components/ui/icons"
import { useSession } from "next-auth/react"

export function UserHeaderNav() {
  const { data: session } = useSession()
  const router = useRouter()

  // commented for now: 
  // const handleLogout = async () => {
  //   try {
  //     signOut({ callbackUrl: "/" })
  //   } catch (error) {
  //     console.error('Logout failed:', error)
  //   }
  // }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="h-10 w-10 rounded-full border border-primary">
          <Avatar className="h-8 w-8">
            <AvatarImage className="object-cover" src={session?.user.avatar ?? undefined} alt="@shadcn" />
            <AvatarFallback>
              {`${session?.user.first_name?.charAt(0) ?? ''}${session?.user.last_name?.charAt(0) ?? ''}`.trim()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {`${session?.user.first_name ?? ''} ${session?.user.middle_name ?? ''}. ${session?.user.last_name ?? ''}`.trim()}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => { router.push('/settings/account') }}>
            <Icons.badgeCheck className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => { router.push('/settings') }}>
            <Icons.settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => { router.push('/notifications') }}>
            <Icons.bell className="mr-2 h-4 w-4" />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {/* <ModeMenu />
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 dark:text-red-400 cursor-pointer"
        >
          <Icons.logout className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}