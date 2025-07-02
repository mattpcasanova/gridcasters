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
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function SignIn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = useSupabase()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({})

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
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
      await signIn(supabase, formData)
      
      const redirectTo = searchParams.get('redirect') || '/dashboard'
      toast.success('Welcome back!')
      router.push(redirectTo)
    } catch (err) {
      console.error('Sign in error:', err)
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during sign in'
      
      if (errorMessage.toLowerCase().includes('invalid credentials')) {
        setErrors({ general: 'Invalid email or password' })
      } else if (errorMessage.toLowerCase().includes('email')) {
        setErrors({ email: errorMessage })
      } else if (errorMessage.toLowerCase().includes('password')) {
        setErrors({ password: errorMessage })
      } else {
        setErrors({ general: errorMessage })
      }
      
      toast.error('Sign in failed', {
        description: 'Please check your credentials and try again'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome Back</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Don't have an account?{" "}
          <Link 
            href="/auth/signup" 
            className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
          >
            Create one here
          </Link>
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
              errors.email && "border-red-500 dark:border-red-400 focus-visible:ring-red-500"
            )}
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, email: e.target.value }))
              if (errors.email) setErrors(prev => ({ ...prev, email: undefined }))
            }}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label 
            htmlFor="password" 
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className={cn(
                "pr-10",
                errors.password && "border-red-500 dark:border-red-400 focus-visible:ring-red-500"
              )}
              placeholder="Enter your password"
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
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              disabled={isLoading}
            />
            <Label 
              htmlFor="remember-me" 
              className="text-sm text-slate-700 dark:text-slate-300"
            >
              Remember me
            </Label>
          </div>
          <Link 
            href="/auth/reset-password" 
            className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <GradientButton 
          type="submit" 
          className="w-full" 
          icon={LogIn} 
          disabled={isLoading}
        >
          {isLoading ? "SIGNING IN..." : "SIGN IN"}
        </GradientButton>
      </form>

      {/* Footer Links */}
      <div className="text-center text-xs text-slate-500 dark:text-slate-400 space-x-4">
        <Link 
          href="/privacy" 
          className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          Privacy & Terms
        </Link>
        <span>•</span>
        <Link 
          href="/support" 
          className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          Support
        </Link>
      </div>
    </div>
  )
} 