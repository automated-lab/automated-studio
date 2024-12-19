export const dynamic = 'force-dynamic'

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const inviteCode = requestUrl.searchParams.get('invite_code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    try {
      console.log('Exchanging code for session...')
      console.log('Invite code from URL:', inviteCode)
      
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) throw error

      if (inviteCode !== process.env.NEXT_PUBLIC_INVITE_CODE) {
        console.log('Invalid invite code:', inviteCode)
        console.log('Expected:', process.env.NEXT_PUBLIC_INVITE_CODE)
        await supabase.auth.signOut()
        return NextResponse.redirect(new URL('/invalid-code', requestUrl.origin))
      }

      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
    } catch (error) {
      console.log('Callback error:', error)
      return NextResponse.redirect(new URL('/signin', requestUrl.origin))
    }
  }

  return NextResponse.redirect(new URL('/signin', requestUrl.origin))
}
