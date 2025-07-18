"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import { useSupabase } from '@/lib/hooks/use-supabase'
import { signIn } from '@/lib/utils/client-auth'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { GradientButton } from "@/components/ui/gradient-button"
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react"
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
    emailOrUsername: '',
    password: '',
  })
  const [errors, setErrors] = useState<{
    emailOrUsername?: string;
    email?: string;
    password?: string;
    general?: string;
  }>({})

  // Handle auth callback errors
  useEffect(() => {
    const error = searchParams.get('error')
    const details = searchParams.get('details')
    
    if (error) {
      let errorMessage = 'An error occurred during authentication'
      
      switch (error) {
        case 'verification_failed':
          if (details) {
            errorMessage = `Email verification failed: ${decodeURIComponent(details)}`
          } else {
            errorMessage = 'Email verification failed. Please try signing up again or contact support.'
          }
          break
        case 'callback_error':
          errorMessage = 'There was an error processing your email verification. Please try again.'
          break
        case 'no_code':
          errorMessage = 'Invalid verification link. Please check your email or request a new verification email.'
          break
        default:
          errorMessage = 'An authentication error occurred. Please try again.'
      }
      
      setErrors({ general: errorMessage })
      toast.error('Authentication Error', {
        description: errorMessage
      })
    }
  }, [searchParams])

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.emailOrUsername) {
      newErrors.emailOrUsername = 'Email or username is required';
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
      } else if (errorMessage.toLowerCase().includes('email not confirmed')) {
        setErrors({ general: 'Please check your email and click the verification link to activate your account.' })
      } else if (errorMessage.toLowerCase().includes('username not found')) {
        setErrors({ emailOrUsername: 'Username not found. Please check your username or try using your email address.' })
      } else if (errorMessage.toLowerCase().includes('email')) {
        setErrors({ emailOrUsername: errorMessage })
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
          <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-400">{errors.general}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label 
            htmlFor="emailOrUsername" 
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Email or Username
          </Label>
          <Input
            id="emailOrUsername"
            name="emailOrUsername"
            type="text"
            autoComplete="email"
            required
            className={cn(
              "mt-1",
              errors.emailOrUsername && "border-red-500 dark:border-red-400 focus-visible:ring-red-500"
            )}
            placeholder="Enter your email address or username"
            value={formData.emailOrUsername}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, emailOrUsername: e.target.value }))
              if (errors.emailOrUsername || errors.general) setErrors(prev => ({ ...prev, emailOrUsername: undefined, general: undefined }))
            }}
            disabled={isLoading}
          />
          {errors.emailOrUsername && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.emailOrUsername}</p>
          )}
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            You can sign in with either your email address or your username
          </p>
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