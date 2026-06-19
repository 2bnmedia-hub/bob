'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import {
  Search, User, ShoppingCart, MapPin, Zap, Plug, Shield, Key,
  Droplets, Flame, Radio, Lock, Tag, ChevronDown
} from 'lucide-react';

const NAV_LINKS = [
  { label: 'קטגוריות', href: '/categories' },
  { label: 'מבצעים', href: '/sales' },
  { label: 'שירותים', href: '/services' },
  { label: 'פרויקטים וטיפים', href: '/tips' },
];

const PILLS = [
  { label: 'מבצעי השבוע', href: '/sales', gold: true, icon: Tag },
  { label: 'מבצעים מיוחדים', href: '/specials', red: true, icon: Zap },
  { label: 'חשמל', href: '/category/electric', icon: Zap },
  { label: 'מכשירי חשמל', href: '/category/appliances', icon: Plug },
  { label: 'חומרי איטום', href: '/category/sealing', icon: Shield },
  { label: 'שכפול מפתחות', href: '/category/keys', icon: Key },
  { label: 'אינסטלציה', href: '/category/plumbing', icon: Droplets },
  { label: 'גז', href: '/category/gas', icon: Flame },
  { label: 'קידוד שלטים', href: '/category/remotes', icon: Radio },
  { label: 'כיתיים', href: '/category/locks', icon: Lock },
];

export default function Header() {
  const { items } = useCart();
  const [search, setSearch] = useState('');
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>

      {/* TOP BAR */}
      <div style={{ background: 'var(--brown)', color: 'var(--gold-light)', padding: '5px var(--px)', direction: 'rtl' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <MapPin size={13} strokeWidth={2} />
            <span>קריית ים — פתוח היום 07:00–19:00</span>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {[['צור קשר','/contact'],['אודות','/about'],['שאלות נפוצות','/faq']].map(([l,h]) => (
              <Link key={h} href={h} style={{ color: 'var(--gold-light)', fontSize: 12 }}>{l}</Link>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div style={{ borderBottom: '1px solid var(--gray-200)', padding: '10px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 20, direction: 'rtl' }}>

          {/* LOGO */}
          <Link href="/" style={{ flexShrink: 0 }}>
            <Image src="/logo.png" alt="בוב חומרי בניין" width={100} height={60} style={{ objectFit: 'contain' }} />
          </Link>

          {/* NAV */}
          <nav style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 600, color: 'var(--brown)', padding: '7px 12px', borderRadius: 6 }}>
                {l.label} <ChevronDown size={14} strokeWidth={2.5} />
              </Link>
            ))}
          </nav>

          {/* SEARCH */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', margin: '0 8px', border: '2px solid var(--gold)', borderRadius: 10, background: 'var(--gray-50)', overflow: 'hidden' }}>
            <div style={{ padding: '0 14px', display: 'flex', alignItems: 'center', borderLeft: '1px solid var(--gray-200)' }}>
              <Search size={18} color="var(--gold-dark)" strokeWidth={2} />
            </div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="חיפוש מוצרים, מותגים, קטגוריות..."
              style={{ flex: 1, border: 'none', padding: '10px 14px', fontSize: 15, outline: 'none', fontFamily: 'var(--font)', direction: 'rtl', background: 'transparent' }}
            />
          </div>

          {/* USER + CART */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexShrink: 0 }}>
            <Link href="/account" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: 'var(--brown)', fontSize: 11, fontWeight: 600, textDecoration: 'none' }}>
              <User size={22} strokeWidth={1.8} />
              <span>כניסה</span>
            </Link>
            <Link href="/cart" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: 'var(--brown)', fontSize: 11, fontWeight: 600, textDecoration: 'none' }}>
              <ShoppingCart size={22} strokeWidth={1.8} />
              <span>סל קניות</span>
              {count > 0 && (
                <span style={{ position: 'absolute', top: -6, left: -6, background: 'var(--red)', color: '#fff', fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{count}</span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* PILLS */}
      <div style={{ background: 'var(--cream)', borderBottom: '1px solid var(--cream-dark)' }}>
        <div className="container" style={{ display: 'flex', gap: 8, padding: '10px 0', direction: 'rtl', justifyContent: 'center', flexWrap: 'wrap' }}>
          {PILLS.map(p => {
            const Icon = p.icon;
            return (
              <Link key={p.href} href={p.href} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                padding: '10px 18px', borderRadius: 12, fontSize: 14, fontWeight: 600,
                border: p.gold ? '1.5px solid var(--gold)' : p.red ? '1.5px solid var(--red)' : '1.5px solid var(--gray-200)',
                background: p.gold ? 'var(--gold)' : p.red ? 'var(--red)' : '#fff',
                color: p.gold ? 'var(--brown-dark)' : p.red ? '#fff' : 'var(--gray-600)',
                textDecoration: 'none', minWidth: 80, textAlign: 'center', transition: 'all 0.18s',
              }}>
                <Icon size={24} strokeWidth={1.8} />
                <span>{p.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
