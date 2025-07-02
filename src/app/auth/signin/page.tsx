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
import Image from "next/image"

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

    try {
      await signIn(supabase, formData)
      const redirectTo = searchParams.get('redirect') || '/dashboard'
      router.push(redirectTo)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Features */}
      <div className="flex-1 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden flex items-center justify-center p-8">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-32 right-16 w-40 h-40 bg-purple-500/20 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-500/20 rounded-full blur-xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-md text-center text-white">
          {/* Logo */}
          <div className="mb-12">
            <Image
              src="/logo.svg"
              alt="RankBet"
              width={120}
              height={120}
              className="mx-auto drop-shadow-2xl"
            />
          </div>

          {/* Feature Highlights */}
          <div className="space-y-8">
            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-2">Track Your Accuracy</h3>
              <p className="text-blue-100">Advanced analytics to measure your fantasy football prediction skills</p>
            </div>

            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-2">Compete Globally</h3>
              <p className="text-blue-100">Rise through the ranks on our global leaderboards</p>
            </div>

            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-2">Connect with Experts</h3>
              <p className="text-blue-100">Follow verified analysts and learn from the best</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="flex-1 bg-white dark:bg-slate-900 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
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
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
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
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
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
      </div>
    </div>
  )
} 