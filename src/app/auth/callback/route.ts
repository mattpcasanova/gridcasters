import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/lib/supabase/types'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  if (code) {
    const cookieStore = cookies()
    
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
        auth: {
          flowType: 'implicit',
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      }
    )
    
    try {
      console.log('Starting email verification for code:', code.substring(0, 10) + '...')
      
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Email verification error:', {
          message: error.message,
          code: error.code,
          status: error.status
        })
        return NextResponse.redirect(`${requestUrl.origin}/auth/signin?error=verification_failed&details=${encodeURIComponent(error.message)}`)
      }

      if (data.user) {
        console.log('Email verified successfully for user:', data.user.id)
        
        // Check if user profile exists
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single()

        console.log('Profile check result:', { 
          profileExists: !!profile, 
          profileError: profileError?.message,
          profileErrorCode: profileError?.code,
          userId: data.user.id 
        })

        if (profile) {
          console.log('Profile exists, updating email_confirmed status for user:', data.user.id)
          
          // Update existing profile to mark email as confirmed
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ email_confirmed: true })
            .eq('id', data.user.id)

          if (updateError) {
            console.error('Profile update failed:', {
              error: updateError.message,
              code: updateError.code,
              details: updateError.details,
              hint: updateError.hint
            })
            // Don't fail the entire flow for profile update errors
          } else {
            console.log('Profile email_confirmed updated successfully for user:', data.user.id)
          }
        } else if (profileError?.code === 'PGRST116') {
          console.log('Profile not found, creating profile for user:', data.user.id)
          
          // Get username from user metadata or generate one
          const username = data.user.user_metadata?.username || 
                          data.user.email?.split('@')[0] || 
                          `user_${data.user.id.slice(0, 8)}`
          
          const displayName = data.user.user_metadata?.display_name || 
                             data.user.email?.split('@')[0] || 
                             'New User'
          
          console.log('Creating profile with:', { username, displayName, userId: data.user.id })
          
          // Use the database function to create the profile (bypasses RLS and handles foreign keys better)
          const { error: createError } = await supabase.rpc('create_profile_on_signup', {
            user_id: data.user.id,
            username: username,
            display_name: displayName,
            email_confirmed: true // User just confirmed their email
          })

          if (createError) {
            console.error('Profile creation failed:', {
              error: createError.message,
              code: createError.code,
              details: createError.details,
              hint: createError.hint
            })
            // Continue anyway - profile can be created later
          } else {
            console.log('Profile created successfully for user:', data.user.id)
          }
        }

        // Redirect to dashboard on successful verification
        console.log('Email verification completed successfully, redirecting to:', next)
        return NextResponse.redirect(`${requestUrl.origin}${next}?verified=true`)
      }
    } catch (err) {
      console.error('Callback error:', err)
      return NextResponse.redirect(`${requestUrl.origin}/auth/signin?error=callback_error`)
    }
  }

  // If no code or verification failed, redirect to signin
  return NextResponse.redirect(`${requestUrl.origin}/auth/signin?error=no_code`)
} 