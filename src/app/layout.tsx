import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { createServerClient } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'
import { NavigationHeader } from "@/components/layout/navigation-header"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RankBet - Fantasy Football Ranking Platform",
  description: "Create, track, and compare your fantasy football player rankings with statistical accuracy scoring.",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const headersList = headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || '/'

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
  const { data: { session } } = await supabase.auth.getSession()
  const isSignedIn = !!session

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {!isSignedIn || pathname.startsWith('/auth') ? (
            children
          ) : (
            <>
              <NavigationHeader isSignedIn={isSignedIn} />
              <main className="min-h-[calc(100vh-4rem)]">
                {children}
              </main>
            </>
          )}
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
