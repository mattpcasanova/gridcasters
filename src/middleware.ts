import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from './lib/supabase/types';

export async function middleware(req: NextRequest) {
  console.log('Middleware: Processing request for path:', req.nextUrl.pathname);

  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  try {
    console.log('Middleware: Creating Supabase client...');
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const cookie = req.cookies.get(name);
            console.log('Middleware: Getting cookie:', name, cookie?.value ? '[value present]' : '[no value]');
            return cookie?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            console.log('Middleware: Setting cookie:', name);
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: CookieOptions) {
            console.log('Middleware: Removing cookie:', name);
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    console.log('Middleware: Getting session...');
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Middleware: Session present:', !!session);

    // Define protected paths that require authentication
    const protectedPaths = [
      '/dashboard',
      '/rankings',
      '/profile',
      '/find-friends',
      '/find-groups',
      '/settings',
      '/leaderboard'
    ];

    const isProtectedPath = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path));
    console.log('Middleware: Is protected path:', isProtectedPath);

    // Redirect to sign in if accessing protected route without session
    if (isProtectedPath && !session) {
      console.log('Middleware: Redirecting to sign in page');
      const redirectUrl = new URL('/auth/signin', req.url);
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Redirect to dashboard if accessing auth pages while logged in
    if (session && (
      req.nextUrl.pathname.startsWith('/auth/signin') || 
      req.nextUrl.pathname.startsWith('/auth/signup')
    )) {
      console.log('Middleware: Redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    console.log('Middleware: Request processed successfully');
    return response;
  } catch (error) {
    console.error('Middleware: Error processing request:', error);
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 