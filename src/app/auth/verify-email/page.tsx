"use client"

import Link from "next/link"
import { GradientButton } from "@/components/ui/gradient-button"
import { Mail, CheckCircle, Clock } from "lucide-react"

export default function VerifyEmail() {
  return (
    <div className="space-y-8 text-center">
      <div className="rounded-full bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 w-20 h-20 mx-auto flex items-center justify-center">
        <Mail className="h-10 w-10 text-blue-600 dark:text-blue-400" />
      </div>

      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Check your email
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          We've sent you a verification link to complete your RankBet account setup.
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center space-x-3 text-left">
          <div className="flex-shrink-0">
            <Clock className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              Check your inbox
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              The verification email should arrive within a few minutes
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 text-left">
          <div className="flex-shrink-0">
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              Click the verification link
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              You'll be automatically signed in and taken to your dashboard
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Didn't receive the email? Check your spam folder or{" "}
          <Link href="/support" className="text-blue-600 hover:text-blue-500 font-medium">
            contact support
          </Link>
        </p>
        
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <Link href="/auth/signin">
            <GradientButton className="w-full">
              RETURN TO SIGN IN
            </GradientButton>
          </Link>
        </div>
      </div>
    </div>
  )
} 