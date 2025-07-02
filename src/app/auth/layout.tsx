import { Metadata } from 'next';
import { headers } from 'next/headers';
import { AuthLayoutClient } from '@/components/layout/auth-layout-client';

export const metadata: Metadata = {
  title: 'Authentication - RankBet',
  description: 'Sign in or create an account to start ranking players and competing with others.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Force dynamic rendering to avoid hydration issues
  headers();
  
  return (
    <AuthLayoutClient>
      {children}
    </AuthLayoutClient>
  );
} 