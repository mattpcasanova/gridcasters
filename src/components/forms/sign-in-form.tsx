import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useSupabase } from '@/lib/hooks/use-supabase'
import { signIn } from '@/lib/utils/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = useSupabase()
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
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Welcome back</h2>
        <p className="mt-2 text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            href="/auth/signup"
            className="font-medium text-primary hover:text-primary/90"
          >
            Sign up
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-4">
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
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>

          <div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link
              href="/auth/reset-password"
              className="font-medium text-primary hover:text-primary/90"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </div>
  )
} 