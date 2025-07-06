"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BarChart3, Trophy, Users, User, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { NoSSR } from "@/components/ui/no-ssr"
import { useSupabase } from "@/lib/hooks/use-supabase"

interface NavigationHeaderProps {
  rightButtons?: React.ReactNode
  isSignedIn?: boolean
}

type UserProfile = {
  username: string
  display_name: string | null
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
}

function NavLinks({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname()
  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/rankings", label: "Rankings", icon: Users },
    { href: "/profile", label: "Profile", icon: User },
  ]

  return (
    <>
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-300 font-medium ${
              isActive
                ? "bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md hover:shadow-lg transform hover:scale-105"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700"
            } ${mobile ? "w-full justify-start" : ""}`}
            onClick={onNavigate}
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </>
  )
}

export function NavigationHeader({ rightButtons, isSignedIn = true }: NavigationHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const logoHref = isSignedIn ? "/dashboard" : "/"
  const supabase = useSupabase()

  // Fetch user profile data
  useEffect(() => {
    if (!isSignedIn) return

    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('username, display_name, first_name, last_name, avatar_url')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching profile for header:', error)
          return
        }

        setProfile(profileData)
      } catch (error) {
        console.error('Error fetching profile for header:', error)
      }
    }

    fetchProfile()
  }, [supabase, isSignedIn])

  const getInitials = (profile: UserProfile) => {
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
    }
    if (profile.display_name) {
      const names = profile.display_name.split(' ')
      return names.length > 1 
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : names[0][0].toUpperCase()
    }
    return profile.username[0].toUpperCase()
  }

  return (
    <header className="border-b bg-white dark:bg-slate-800 dark:border-slate-700">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href={logoHref} className="flex items-center space-x-3">
            <Image src="/logo.svg" alt="GridCasters Logo" width={40} height={40} className="w-10 h-10" />
            <span className="text-2xl font-bold">
              <span className="text-blue-600 dark:text-blue-400">Grid</span>
              <span className="text-green-600 dark:text-green-400">Casters</span>
            </span>
          </Link>

          {isSignedIn && (
            <nav className="hidden md:flex items-center space-x-6">
              <NavLinks />
            </nav>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {rightButtons}
          {isSignedIn && (
            <>
              <NoSSR fallback={
                <Button variant="ghost" size="sm" className="md:hidden" disabled>
                  <Menu className="w-5 h-5" />
                </Button>
              }>
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="md:hidden">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-64">
                    <div className="flex flex-col space-y-4 mt-8">
                      <NavLinks mobile onNavigate={() => setMobileMenuOpen(false)} />
                    </div>
                  </SheetContent>
                </Sheet>
              </NoSSR>

              <Link href="/profile">
                <Avatar className="cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
                  <AvatarImage src={profile?.avatar_url || "/placeholder-user.jpg"} />
                  <AvatarFallback>{profile ? getInitials(profile) : "U"}</AvatarFallback>
                </Avatar>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
} 