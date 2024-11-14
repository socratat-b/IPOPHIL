import "./globals.css"

import type { Metadata } from "next"

import localFont from "next/font/local"

import { Toaster } from "sonner"
import { ThemeProvider } from 'next-themes'
import { NextAuthProvider } from "@/providers/auth-provider"
import { LoadingProvider } from "@/components/loading/loading-provider"
import { ClientRouteLoadingWrapper } from "@/components/loading/client-wrapper"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "DMS",
  description: "IPOPHIL Web Application",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.className} ${geistMono.variable} antialiased`} suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href="/logo.svg"
          sizes="any"
          type="image/svg+xml"
        />
      </head>
      <body className="text-foreground select-none">
        <NextAuthProvider>
          <LoadingProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <ClientRouteLoadingWrapper>
                {children}
                <Toaster richColors />
              </ClientRouteLoadingWrapper>
            </ThemeProvider>
          </LoadingProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}