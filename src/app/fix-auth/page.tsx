"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/lib/hooks/use-supabase"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function FixAuth() {
  const [loading, setLoading] = useState(false)
  const supabase = useSupabase()
  const router = useRouter()

  const forceSignOut = async () => {
    try {
      setLoading(true)
      
      // Force sign out
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Sign out error:', error)
        toast.error('Failed to sign out: ' + error.message)
        return
      }

      // Clear any local storage
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
      }

      toast.success('Signed out successfully! Please sign back in.')
      
      // Redirect to sign in page
      setTimeout(() => {
        router.push('/signin')
      }, 1000)

    } catch (error) {
      console.error('Error:', error)
      toast.error('Error: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const checkAuth = async () => {
    try {
      setLoading(true)
      
      // Check current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      console.log('Current session:', session)
      console.log('Session error:', sessionError)

      // Check current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      console.log('Current user:', user)
      console.log('User error:', userError)

      if (user) {
        toast.success('User is authenticated: ' + user.email)
      } else {
        toast.error('No user found')
      }

    } catch (error) {
      console.error('Error:', error)
      toast.error('Error: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Fix Authentication Issues</h1>
      <div className="space-y-4">
        <Button onClick={checkAuth} disabled={loading}>
          {loading ? 'Checking...' : 'Check Current Auth Status'}
        </Button>
        <Button onClick={forceSignOut} disabled={loading} variant="destructive">
          {loading ? 'Signing Out...' : 'Force Sign Out & Clear All Data'}
        </Button>
      </div>
      <p className="mt-4 text-sm text-gray-600">
        This will sign you out completely and clear all local data. You'll need to sign back in.
      </p>
    </div>
  )
} 