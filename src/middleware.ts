import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/admin')) return NextResponse.next()
  if (req.nextUrl.pathname === '/admin/login') return NextResponse.next()

  const token = req.cookies.get('sb-access-token')?.value
    || req.cookies.get('sb-qaneanzpipjtnlonqmyd-auth-token')?.value
    || req.cookies.getAll().find(c => c.name.includes('auth-token'))?.value

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*'] }
