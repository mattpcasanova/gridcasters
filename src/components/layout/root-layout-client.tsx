"use client";

import { useEffect, useState, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';
import { useSupabase } from '@/lib/hooks/use-supabase';
import { NavigationHeader } from './navigation-header';
import type { Session } from '@supabase/supabase-js';

interface RootLayoutClientProps {
  children: React.ReactNode;
  initialSession: Session | null;
}

interface HeaderContextType {
  setRightButtons: (buttons: React.ReactNode) => void;
}

const HeaderContext = createContext<HeaderContextType | null>(null);

export function useHeaderButtons() {
  const context = useContext(HeaderContext);
  if (!context) {
    // Return a no-op function when context is not available
    return { setRightButtons: () => {} };
  }
  return context;
}

export function RootLayoutClient({ children, initialSession }: RootLayoutClientProps) {
  const [session, setSession] = useState<Session | null>(initialSession);
  const [mounted, setMounted] = useState(false);
  const [rightButtons, setRightButtons] = useState<React.ReactNode>(null);
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

  // Clear buttons when pathname changes
  useEffect(() => {
    setRightButtons(null);
  }, [pathname]);

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
  const isHomePage = pathname === '/';

  // Don't show navigation header for non-signed in users, auth pages, or homepage
  if (!isSignedIn || isAuthPage || isHomePage) {
    return <>{children}</>;
  }

  return (
    <HeaderContext.Provider value={{ setRightButtons }}>
      <NavigationHeader isSignedIn={isSignedIn} rightButtons={rightButtons} />
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </HeaderContext.Provider>
  );
} 