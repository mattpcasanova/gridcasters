"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GradientButton } from "@/components/ui/gradient-button"
import { Mail } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useSupabase } from "@/lib/hooks/use-supabase"

export default function ResetPassword() {
  const supabase = useSupabase()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string>()
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(undefined)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })

      if (error) {
        throw error
      }

      setSuccess(true)
      toast.success("Check your email for the reset link")
    } catch (err) {
      console.error("Reset password error:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to send reset email"
      setError(errorMessage)
      toast.error("Failed to send reset email")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Check Your Email</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          We've sent a password reset link to {email}
        </p>
        <Link 
          href="/auth/signin" 
          className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
        >
          Return to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reset Password</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Enter your email to receive a password reset link
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label 
            htmlFor="email" 
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={cn(
              "mt-1",
              error && "border-red-500 dark:border-red-400 focus-visible:ring-red-500"
            )}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (error) setError(undefined)
            }}
            disabled={isLoading}
          />
        </div>

        <GradientButton 
          type="submit" 
          className="w-full" 
          icon={Mail}
          disabled={isLoading}
        >
          {isLoading ? "SENDING..." : "SEND RESET LINK"}
        </GradientButton>

        <div className="text-center">
          <Link 
            href="/auth/signin" 
            className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </form>
    </div>
  )
} 