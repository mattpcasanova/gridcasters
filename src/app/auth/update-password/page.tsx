"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GradientButton } from "@/components/ui/gradient-button"
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useSupabase } from "@/lib/hooks/use-supabase"
import { updatePassword } from "@/lib/utils/client-auth"

export default function UpdatePassword() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = useSupabase()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({})

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Invalid or expired reset link')
        router.push('/auth/signin')
      }
    }
    checkAuth()
  }, [supabase, router])

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one letter and one number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true)
    setErrors({})

    try {
      await updatePassword(supabase, formData.password)
      
      setIsSuccess(true)
      toast.success('Password updated successfully!')
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err) {
      console.error('Update password error:', err)
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while updating your password'
      
      if (errorMessage.toLowerCase().includes('password')) {
        setErrors({ password: errorMessage })
      } else {
        setErrors({ general: errorMessage })
      }
      
      toast.error('Failed to update password', {
        description: 'Please try again'
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Password Updated!</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Your password has been successfully updated. You'll be redirected to your dashboard shortly.
        </p>
        <Link 
          href="/dashboard" 
          className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Update Password</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Enter your new password below
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
            <p className="text-sm text-red-700 dark:text-red-400">{errors.general}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label 
            htmlFor="password" 
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            New Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              className={cn(
                "pr-10",
                errors.password && "border-red-500 dark:border-red-400 focus-visible:ring-red-500"
              )}
              placeholder="Enter your new password"
              value={formData.password}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, password: e.target.value }))
                if (errors.password) setErrors(prev => ({ ...prev, password: undefined }))
              }}
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-slate-400" />
              ) : (
                <Eye className="h-4 w-4 text-slate-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.password}</p>
          )}
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Password must be at least 8 characters and contain at least one letter and one number
          </p>
        </div>

        <div className="space-y-2">
          <Label 
            htmlFor="confirmPassword" 
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Confirm New Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              className={cn(
                "pr-10",
                errors.confirmPassword && "border-red-500 dark:border-red-400 focus-visible:ring-red-500"
              )}
              placeholder="Confirm your new password"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))
                if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }))
              }}
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-slate-400" />
              ) : (
                <Eye className="h-4 w-4 text-slate-400" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        <GradientButton 
          type="submit" 
          className="w-full" 
          icon={Lock}
          disabled={isLoading}
        >
          {isLoading ? "UPDATING..." : "UPDATE PASSWORD"}
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