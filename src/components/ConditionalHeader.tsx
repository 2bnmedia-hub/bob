'use client'
import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import Link from 'next/link'

export function ConditionalHeader() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) {
    return (
      <div style={{ background: '#1a1a1a', padding: '8px 24px', display: 'flex', justifyContent: 'flex-end', direction: 'rtl' }}>
        <Link href="/" style={{ background: '#F0C040', color: '#111', fontWeight: 700, fontSize: 13, padding: '7px 18px', borderRadius: 8, textDecoration: 'none' }}>
          ← חזרה לאתר
        </Link>
      </div>
    )
  }
  return <Header />
}

export function ConditionalFooter() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null
  return <Footer />
}
