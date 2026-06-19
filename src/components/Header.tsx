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
      <div style={{ background: '#fff', color: '#111', padding: '5px var(--px)', direction: 'rtl' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <MapPin size={13} strokeWidth={2} />
            <span>קריית ים — פתוח היום 07:00–19:00</span>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {[['צור קשר','/contact'],['אודות','/about'],['שאלות נפוצות','/faq']].map(([l,h]) => (
              <Link key={h} href={h} style={{ color: '#333', fontSize: 12 }}>{l}</Link>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div style={{ borderBottom: '1px solid var(--gray-200)', padding: '10px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 20, direction: 'rtl' }}>

          {/* LOGO */}
                  {/* LOGO */}
        <style>{`
          @keyframes logoFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-4px); }
          }
          @keyframes logoShine {
            0% { left: -100%; }
            100% { left: 200%; }
          }
          .logo-wrap {
            position: relative;
            overflow: hidden;
            display: inline-block;
            animation: logoFloat 3s ease-in-out infinite;
            cursor: pointer;
          }
          .logo-wrap::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 60%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
            animation: logoShine 2.5s ease-in-out infinite;
          }
          .logo-wrap:hover {
            animation: none;
            transform: scale(1.06);
            transition: transform 0.2s ease;
          }
        `}</style>
        <Link href="/" style={{ flexShrink: 0 }}>
          <div className="logo-wrap">
            <Image src="/logo.png" alt="בוב חומרי בניין" width={133} height={80} style={{ objectFit: 'contain', display: 'block' }} />
          </div>
        </Link>

          {/* NAV */}
          <nav style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 600, color: '#111', padding: '7px 12px', borderRadius: 6 }}>
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
            <Link href="/account" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: '#111', fontSize: 11, fontWeight: 600, textDecoration: 'none' }}>
              <User size={22} strokeWidth={1.8} />
              <span>כניסה</span>
            </Link>
            <Link href="/cart" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: '#111', fontSize: 11, fontWeight: 600, textDecoration: 'none' }}>
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
      <style>{`
        .pill-link { display:flex; flex-direction:column; align-items:center; gap:6px; padding:12px 0; text-decoration:none; transition:all 0.22s; flex:1; border-left:1px solid rgba(0,0,0,0.06); }
        .pill-link:last-child { border-left:none; }
        .pill-link:hover { background:rgba(0,0,0,0.04); }
        .pill-link:hover span { transform:scale(1.12); }
        .pill-link:hover svg { transform:scale(1.1); }
        .pill-link span { display:inline-block; transition:transform 0.22s; }
        .pill-link svg { transition:transform 0.22s; }
        .pill-link.gold { background:var(--gold); }
        .pill-link.gold:hover { background:var(--gold-dark); }
        .pill-link.red { background:#2D6A4F; }
        .pill-link.red:hover { background:#1e4f38; }
      `}</style>
      <div style={{ background: '#f8f8f8', borderBottom: '1px solid #e8e8e8', borderTop: '1px solid #e8e8e8' }}>
        <div style={{ display: 'flex', direction: 'rtl', width: '100%' }}>
          {PILLS.map(p => {
            const Icon = p.icon;
            return (
              <Link key={p.href} href={p.href}
                className={`pill-link${p.gold ? ' gold' : p.red ? ' red' : ''}`}
                style={{
                  fontSize: 13, fontWeight: 500,
                  color: p.gold ? '#111' : p.red ? '#fff' : '#444',
                }}>
                <Icon size={22} strokeWidth={1.8} />
                <span>{p.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
