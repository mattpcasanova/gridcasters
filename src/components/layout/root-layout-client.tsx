"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSupabase } from '@/lib/hooks/use-supabase';
import { NavigationHeader } from './navigation-header';
import type { Session } from '@supabase/supabase-js';

interface RootLayoutClientProps {
  children: React.ReactNode;
  initialSession: Session | null;
}

export function RootLayoutClient({ children, initialSession }: RootLayoutClientProps) {
  const [session, setSession] = useState<Session | null>(initialSession);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const supabase = useSupabase();

  useEffect(() => {
    setMounted(true);
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // During hydration, always render the same structure
  if (!mounted) {
    return (
      <>
        {children}
      </>
    );
  }

  const isSignedIn = !!session;
  const isAuthPage = pathname.startsWith('/auth');

  if (!isSignedIn || isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <NavigationHeader isSignedIn={isSignedIn} />
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </>
  );
} 