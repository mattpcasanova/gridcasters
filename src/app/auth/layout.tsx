import { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'Authentication - GridCasters',
  description: 'Sign in or create an account to start ranking players and competing with others.',
};

// Dynamically import the auth layout with no SSR to prevent hydration issues
const AuthLayoutClient = dynamic(() => import('@/components/layout/auth-layout-client').then(mod => ({ default: mod.AuthLayoutClient })), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen">
      <div className="hidden lg:block flex-1 bg-gradient-to-br from-blue-600 via-blue-800 to-slate-900" />
      <div className="flex-1 bg-white dark:bg-slate-900 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden h-24 mb-8" />
          <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthLayoutClient>
      {children}
    </AuthLayoutClient>
  );
} 