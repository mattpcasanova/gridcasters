'use client';

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSupabase } from '@/lib/hooks/use-supabase'
import { signUp } from '@/lib/utils/client-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export function SignUpForm() {
  const router = useRouter()
  const supabase = useSupabase()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    firstName: '',
    lastName: '',
    birthDate: '',
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // First check if the user already exists
      const { data: existingUsers } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', formData.username)
        .limit(1)

      if (existingUsers && existingUsers.length > 0) {
        setError('This username is already taken. Please choose another.')
        setIsLoading(false)
        return
      }

      // Proceed with sign up
      await signUp(supabase, formData)
      toast.success('Account created successfully! Please check your email to verify your account.')
      router.push('/auth/verify-email')
    } catch (err) {
      console.error('Sign up error:', err)
      if (err instanceof Error) {
        // Handle specific error cases
        if (err.message.includes('duplicate key') || err.message.includes('already registered')) {
          setError('This email is already registered. Please sign in instead.')
        } else if (err.message.includes('invalid email')) {
          setError('Please enter a valid email address.')
        } else if (err.message.includes('weak password')) {
          setError('Password is too weak. Please use at least 8 characters with letters and numbers.')
        } else if (err.message.includes('row-level security')) {
          setError('There was an error creating your profile. Please try again.')
        } else {
          setError(err.message)
        }
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
      toast.error('Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Create your account</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            href="/auth/signin"
            className="font-medium text-primary hover:text-primary/90"
          >
            Sign in
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                placeholder="First name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                }
                disabled={isLoading}
              />
            </div>
            <div>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                }
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <Input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              placeholder="Username"
              pattern="^[a-zA-Z0-9_]{3,20}$"
              title="Username must be between 3 and 20 characters and can only contain letters, numbers, and underscores"
              value={formData.username}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, username: e.target.value.toLowerCase() }))
              }
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              autoComplete="bday"
              required
              placeholder="Birth date"
              value={formData.birthDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, birthDate: e.target.value }))
              }
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value.toLowerCase() }))
              }
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Password"
              pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
              title="Password must be at least 8 characters long and contain at least one letter and one number"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          By signing up, you agree to our{' '}
          <Link
            href="/terms"
            className="font-medium text-primary hover:text-primary/90"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy"
            className="font-medium text-primary hover:text-primary/90"
          >
            Privacy Policy
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Sign up
        </Button>
      </form>
    </div>
  )
} 