import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  if (!req.nextUrl.pathname.startsWith('/admin')) return res
  if (req.nextUrl.pathname === '/admin/login') return res

  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
  return res
}

export const config = { matcher: ['/admin/:path*'] }
