import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Add this block to check for admin access
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/signin', req.url))
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin, email')
      .eq('id', session.user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // Protect dashboard routes
  if (!session && (
    req.nextUrl.pathname.startsWith('/dashboard') ||
    req.nextUrl.pathname.startsWith('/clients') ||
    req.nextUrl.pathname.startsWith('/settings')
  )) {
    const redirectUrl = new URL('/signin', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect signed-in users away from auth pages
  if (session && (
    req.nextUrl.pathname === '/signin' ||
    req.nextUrl.pathname === '/signup'
  )) {
    const redirectUrl = new URL('/dashboard', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
