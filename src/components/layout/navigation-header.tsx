"use client"

import type React from "react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BarChart3, Trophy, Users, User, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

interface NavigationHeaderProps {
  rightButtons?: React.ReactNode
  isSignedIn?: boolean
}

function MobileMenu({ isOpen, onOpenChange, children }: { isOpen: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <div className="flex flex-col space-y-4 mt-8">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
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
  const logoHref = isSignedIn ? "/dashboard" : "/"

  return (
    <header className="border-b bg-white dark:bg-slate-800 dark:border-slate-700">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href={logoHref} className="flex items-center space-x-3">
            <Image src="/logo.svg" alt="RankBet Logo" width={40} height={40} className="w-10 h-10" />
            <span className="text-2xl font-bold">
              <span className="text-blue-600 dark:text-blue-400">Rank</span>
              <span className="text-green-600 dark:text-green-400">Bet</span>
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
              <MobileMenu isOpen={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <NavLinks mobile onNavigate={() => setMobileMenuOpen(false)} />
              </MobileMenu>

              <Link href="/profile">
                <Avatar className="cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
} 