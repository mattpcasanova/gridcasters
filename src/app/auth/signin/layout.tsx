import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - GridCasters',
  description: 'Sign in to your GridCasters account',
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 