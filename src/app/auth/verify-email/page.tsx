"use client"

import Link from "next/link"
import { GradientButton } from "@/components/ui/gradient-button"
import { Mail } from "lucide-react"

export default function VerifyEmail() {
  return (
    <div className="max-w-md mx-auto text-center space-y-8 p-8">
      <div className="rounded-full bg-blue-100 dark:bg-blue-900 w-16 h-16 mx-auto flex items-center justify-center">
        <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Check your email
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          We've sent you a verification link. Please check your email and click the link to verify your account.
        </p>
      </div>

      <div className="space-y-4">
        <Link href="/auth/signin">
          <GradientButton className="w-full">
            RETURN TO SIGN IN
          </GradientButton>
        </Link>

        <p className="text-sm text-slate-500">
          Didn't receive the email?{" "}
          <Link href="/support" className="text-blue-600 hover:text-blue-500">
            Contact support
          </Link>
        </p>
      </div>
    </div>
  )
} 