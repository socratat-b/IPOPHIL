'use client'

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { Loading } from "./loading"

export function ClientRouteLoadingWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  return (
    <>
      {isLoading && <Loading />}
      {children}
    </>
  )
}