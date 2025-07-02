import { SignInForm } from '@/components/forms/sign-in-form'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - RankBet',
  description: 'Sign in to your RankBet account',
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SignInForm />
    </div>
  )
} 