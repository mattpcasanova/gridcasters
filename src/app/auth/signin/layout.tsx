import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - RankBet',
  description: 'Sign in to your RankBet account',
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 