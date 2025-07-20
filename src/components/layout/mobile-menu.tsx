"use client"

import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, BarChart3, Trophy, Users, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface MobileMenuProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onNavigate: () => void
}

function NavLinks({ onNavigate }: { onNavigate: () => void }) {
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
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-300 font-medium w-full justify-start ${
              isActive
                ? "bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md hover:shadow-lg transform hover:scale-105"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
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

export default function MobileMenu({ isOpen, onOpenChange, onNavigate }: MobileMenuProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">Main navigation menu for GridCasters</SheetDescription>
        <div className="flex flex-col space-y-4 mt-8">
          <NavLinks onNavigate={onNavigate} />
        </div>
      </SheetContent>
    </Sheet>
  )
} 