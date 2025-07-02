"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { GradientButton } from "@/components/ui/gradient-button"
import { Eye, EyeOff, UserPlus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/hooks/use-supabase"

export default function SignUp() {
  const router = useRouter()
  const supabase = useSupabase()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!agreeToTerms) {
      setError("Please agree to the terms and conditions")
      return
    }

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const username = formData.get("username") as string

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            username,
          },
        },
      })

      if (signUpError) throw signUpError

      router.push("/auth/verify-email")
    } catch (err) {
      console.error("Sign up error:", err)
      setError(err instanceof Error ? err.message : "An error occurred during sign up")
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
              <h3 className="text-xl font-bold mb-2">Start Ranking Today</h3>
              <p className="text-blue-100">Create your first fantasy football rankings and see how you stack up</p>
            </div>

            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-2">Join the Community</h3>
              <p className="text-blue-100">Connect with thousands of fantasy football enthusiasts</p>
            </div>

            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-2">Prove Your Skills</h3>
              <p className="text-blue-100">Climb the leaderboards and become a verified expert</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="flex-1 bg-white dark:bg-slate-900 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create Account</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-200 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  className="mt-1"
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  className="mt-1"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="mt-1"
                placeholder="johndoe"
              />
            </div>

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
                placeholder="john@example.com"
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
                  autoComplete="new-password"
                  required
                  className="pr-10"
                  placeholder="Create a strong password"
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

            <div>
              <Label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Confirm Password
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="agree-terms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
              />
              <Label
                htmlFor="agree-terms"
                className="text-sm text-slate-600 dark:text-slate-400"
              >
                I agree to the{" "}
                <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <GradientButton
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                "Creating Account..."
              ) : (
                <>
                  Create Account <UserPlus className="ml-2 h-5 w-5" />
                </>
              )}
            </GradientButton>
          </form>
        </div>
      </div>
    </div>
  )
} 