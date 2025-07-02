import { Metadata } from 'next';
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
  return <AuthLayoutClient>{children}</AuthLayoutClient>;
} 