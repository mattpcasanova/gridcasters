"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/lib/hooks/use-supabase'
import { signUp } from '@/lib/utils/client-auth'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { GradientButton } from "@/components/ui/gradient-button"
import { Eye, EyeOff, UserPlus } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function SignUp() {
  const router = useRouter()
  const supabase = useSupabase()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  })
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    username?: string;
    general?: string;
  }>({})

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one letter and one number';
    }
    
    // Username validation
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }
    
    // Terms agreement
    if (!agreeToTerms) {
      newErrors.general = 'You must agree to the Terms of Service and Privacy Policy';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!validateForm()) {
      return;
    }

    // Prevent multiple submissions
    if (isLoading) {
      return;
    }

    setIsLoading(true)
    setErrors({})

    try {
      const result = await signUp(supabase, {
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        username: formData.username.toLowerCase().trim()
      });
      
      toast.success('Account created successfully!', {
        description: 'Please check your email to verify your account.'
      })
      router.push('/auth/verify-email')
    } catch (err) {
      console.error('Sign up error:', err)
      
      let errorMessage = 'An error occurred during sign up';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        errorMessage = String(err.message);
      }
      
      // Handle specific error cases
      if (errorMessage.toLowerCase().includes('rate limit') || errorMessage.includes('wait a moment')) {
        setErrors({ general: errorMessage })
        toast.error('Rate Limited', {
          description: 'Please wait a moment before trying again'
        })
      } else if (errorMessage.toLowerCase().includes('email')) {
        setErrors({ email: errorMessage })
      } else if (errorMessage.toLowerCase().includes('password')) {
        setErrors({ password: errorMessage })
      } else if (errorMessage.toLowerCase().includes('username')) {
        setErrors({ username: errorMessage })
      } else if (errorMessage.toLowerCase().includes('duplicate') || errorMessage.includes('already taken')) {
        setErrors({ username: errorMessage })
      } else if (errorMessage.toLowerCase().includes('already registered')) {
        setErrors({ email: 'This email is already registered' })
      } else {
        setErrors({ general: errorMessage })
      }
      
      toast.error('Sign up failed', {
        description: 'Please check the form for errors and try again'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create Account</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <Link 
            href="/auth/signin" 
            className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
            htmlFor="username" 
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Username
          </Label>
          <Input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            className={cn(
              "mt-1",
              errors.username && "border-red-500 dark:border-red-400 focus-visible:ring-red-500"
            )}
            placeholder="Choose a username"
            value={formData.username}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, username: e.target.value }))
              if (errors.username) setErrors(prev => ({ ...prev, username: undefined }))
            }}
            disabled={isLoading}
          />
          {errors.username && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.username}</p>
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
              autoComplete="new-password"
              required
              className={cn(
                "pr-10",
                errors.password && "border-red-500 dark:border-red-400 focus-visible:ring-red-500"
              )}
              placeholder="Create a password"
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

        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={agreeToTerms}
            onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
            disabled={isLoading}
          />
          <Label 
            htmlFor="terms" 
            className="text-sm text-slate-700 dark:text-slate-300"
          >
            I agree to the{" "}
            <Link 
              href="/terms" 
              className="text-blue-600 hover:text-blue-500 transition-colors"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link 
              href="/privacy" 
              className="text-blue-600 hover:text-blue-500 transition-colors"
            >
              Privacy Policy
            </Link>
          </Label>
        </div>

        <GradientButton 
          type="submit" 
          className="w-full" 
          icon={UserPlus} 
          disabled={!agreeToTerms || isLoading}
        >
          {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
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