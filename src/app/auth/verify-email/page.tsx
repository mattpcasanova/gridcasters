import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h2 className="text-3xl font-bold">Check your email</h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent you a verification link. Please check your email and click the link to verify your account.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Didn't receive the email? Check your spam folder or try signing in again to resend the verification email.
          </p>

          <div className="pt-4">
            <Button
              variant="outline"
              className="w-full"
              asChild
            >
              <Link href="/auth/signin">
                Return to sign in
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 