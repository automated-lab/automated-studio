export const dynamic = 'force-dynamic'

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const inviteCode = requestUrl.searchParams.get('invite_code')

  if (!inviteCode || inviteCode !== process.env.NEXT_PUBLIC_INVITE_CODE) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/signin?error=Invalid invite code`)
  }

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) throw error

      // Successful login - redirect to dashboard
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`)
    } catch (error) {
      console.error('Auth error:', error)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/signin?error=Could not authenticate user`)
    }
  }

  // No code - redirect to signin
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/signin`)
}
