"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import { useSupabase } from '@/lib/hooks/use-supabase'
import { signIn } from '@/lib/utils/client-auth'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { GradientButton } from "@/components/ui/gradient-button"
import { Eye, EyeOff, LogIn } from "lucide-react"
import Link from "next/link"

export default function SignIn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = useSupabase()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    console.log('Starting sign in process...')

    try {
      console.log('Attempting to sign in with email:', formData.email)
      const data = await signIn(supabase, formData)
      console.log('Sign in successful:', data)

      const redirectTo = searchParams.get('redirect') || '/dashboard'
      console.log('Redirecting to:', redirectTo)
      
      router.push(redirectTo)
    } catch (err) {
      console.error('Sign in error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred during sign in')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Sign in</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-blue-600 hover:text-blue-500 font-medium">
            Create one here
          </Link>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div>
          <Label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Password
          </Label>
          <div className="mt-1 relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className="pr-10"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-slate-400" />
              ) : (
                <Eye className="h-4 w-4 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <Label htmlFor="remember-me" className="text-sm text-slate-700 dark:text-slate-300">
              Remember me
            </Label>
          </div>
          <Link href="/auth/reset-password" className="text-sm text-blue-600 hover:text-blue-500">
            Forgot password?
          </Link>
        </div>

        <GradientButton type="submit" className="w-full" icon={LogIn} disabled={isLoading}>
          {isLoading ? "SIGNING IN..." : "CONTINUE"}
        </GradientButton>
      </form>

      {/* Footer Links */}
      <div className="text-center text-xs text-slate-500 space-x-4">
        <Link href="/privacy" className="hover:text-slate-700 dark:hover:text-slate-300">
          Privacy & Terms
        </Link>
        <span>•</span>
        <Link href="/support" className="hover:text-slate-700 dark:hover:text-slate-300">
          Support
        </Link>
      </div>
    </div>
  )
} 