'use client';

import { useState, Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Search, User, ShoppingCart, MapPin, Zap, Plug, Shield, Key, Droplets, Flame, Radio, Lock, Tag, ChevronDown, Menu, X } from 'lucide-react';

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
  const [menuOpen, setMenuOpen] = useState(false);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
      <style>{`
        @keyframes logoFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes logoShine { 0%{left:-100%} 100%{left:200%} }
        .logo-wrap { position:relative; overflow:hidden; display:inline-block; animation:logoFloat 3s ease-in-out infinite; }
        .logo-wrap::after { content:''; position:absolute; top:0; left:-100%; width:60%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.65),transparent); animation:logoShine 2.5s ease-in-out infinite; }
        .logo-wrap:hover { animation:none; transform:scale(1.07); transition:transform 0.2s; }
        .pill-link { display:flex; flex-direction:column; align-items:center; gap:6px; padding:12px 0; text-decoration:none; transition:all 0.22s; flex:1; border-left:1px solid rgba(0,0,0,0.06); min-width:80px; }
        .pill-link:last-child { border-left:none; }
        .pill-link:hover { background:rgba(0,0,0,0.04); }
        .pill-link:hover span { transform:scale(1.12); }
        .pill-link span { display:inline-block; transition:transform 0.22s; }
        .pill-link.gold { background:var(--gold); }
        .pill-link.gold:hover { background:var(--gold-dark); }
        .pill-link.red { background:#2D6A4F; }
        .pill-link.red:hover { background:#1e4f38; }
        .mobile-menu { position:fixed; inset:0; background:#fff; z-index:200; padding:24px 20px; overflow-y:auto; direction:rtl; }
        .mobile-menu-link { display:block; padding:14px 0; font-size:17px; font-weight:600; color:#111; border-bottom:1px solid #f0f0f0; }
        @media (max-width:768px) {
          .desktop-nav { display:none !important; }
          .desktop-pills { display:none !important; }
          .mobile-pills { display:flex !important; }
        }
        @media (min-width:769px) {
          .mobile-menu-btn { display:none !important; }
          .mobile-pills { display:none !important; }
        }
      `}</style>

      {/* TOP BAR */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '5px var(--px)', direction: 'rtl' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#555' }}>
            <MapPin size={13} strokeWidth={2} color="#2D6A4F" />
            <span>קריית ים — פתוח 07:00–19:00</span>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {[['צור קשר','/contact'],['אודות','/about'],['שאלות נפוצות','/faq']].map(([l,h], i) => (
              <Fragment key={h}>
                {i > 0 && <span style={{ width: 1, height: 12, background: '#ddd' }} />}
                <Link href={h} style={{ color: '#555', fontSize: 13 }}>{l}</Link>
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div style={{ borderBottom: '1px solid #f0f0f0', padding: '8px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 16, direction: 'rtl' }}>

          {/* LOGO */}
          <Link href="/" style={{ flexShrink: 0 }}>
            <div className="logo-wrap">
              <Image src="/logo.png" alt="בוב חומרי בניין" width={100} height={60} style={{ objectFit: 'contain', display: 'block' }} />
            </div>
          </Link>

          {/* NAV — desktop */}
          <nav className="desktop-nav" style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 600, color: '#111', padding: '7px 10px', borderRadius: 6 }}>
                {l.label} <ChevronDown size={14} strokeWidth={2.5} />
              </Link>
            ))}
          </nav>

          {/* SEARCH */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: '2px solid var(--gold)', borderRadius: 10, background: '#fafafa', overflow: 'hidden' }}>
            <div style={{ padding: '0 12px', display: 'flex', alignItems: 'center', borderLeft: '1px solid #eee' }}>
              <Search size={17} color="var(--gold-dark)" strokeWidth={2} />
            </div>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="חיפוש מוצרים, מותגים..."
              style={{ flex: 1, border: 'none', padding: '9px 12px', fontSize: 14, outline: 'none', fontFamily: 'var(--font)', direction: 'rtl', background: 'transparent' }} />
          </div>

          {/* ICONS */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
            <Link href="/account" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: '#111', fontSize: 10, fontWeight: 600, textDecoration: 'none' }}>
              <User size={22} strokeWidth={1.8} />
              <span style={{ display: 'none' }} className="desktop-nav">כניסה</span>
            </Link>
            <Link href="/cart" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: '#111', fontSize: 10, fontWeight: 600, textDecoration: 'none' }}>
              <ShoppingCart size={22} strokeWidth={1.8} />
              {count > 0 && (
                <span style={{ position: 'absolute', top: -6, left: -6, background: '#2D6A4F', color: '#fff', fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{count}</span>
              )}
            </Link>
            {/* HAMBURGER */}
            <button className="mobile-menu-btn" onClick={() => setMenuOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <Menu size={24} color="#111" />
            </button>
          </div>
        </div>
      </div>

      {/* PILLS — desktop */}
      <div className="desktop-pills" style={{ background: '#f8f8f8', borderBottom: '1px solid #e8e8e8' }}>
        <div style={{ display: 'flex', direction: 'rtl', width: '100%', overflowX: 'auto' }}>
          {PILLS.map(p => {
            const Icon = p.icon;
            return (
              <Link key={p.href} href={p.href}
                className={`pill-link${p.gold ? ' gold' : p.red ? ' red' : ''}`}
                style={{ fontSize: 12, fontWeight: 500, color: p.gold ? '#111' : p.red ? '#fff' : '#444' }}>
                <Icon size={20} strokeWidth={1.8} />
                <span>{p.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* PILLS — mobile horizontal scroll */}
      <div className="mobile-pills" style={{ display: 'none', overflowX: 'auto', scrollbarWidth: 'none', background: '#f8f8f8', borderBottom: '1px solid #eee', padding: '8px 0' }}>
        <div style={{ display: 'flex', gap: 8, padding: '0 16px', whiteSpace: 'nowrap', direction: 'rtl' }}>
          {PILLS.map(p => {
            const Icon = p.icon;
            return (
              <Link key={p.href} href={p.href} style={{
                display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: '8px 14px', borderRadius: 10, fontSize: 11, fontWeight: 600, flexShrink: 0,
                border: p.gold ? '1.5px solid var(--gold)' : p.red ? 'none' : '1.5px solid #eee',
                background: p.gold ? 'var(--gold)' : p.red ? '#2D6A4F' : '#fff',
                color: p.gold ? '#111' : p.red ? '#fff' : '#555',
                textDecoration: 'none',
              }}>
                <Icon size={18} strokeWidth={1.8} />
                <span>{p.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <Image src="/logo.png" alt="BOB" width={80} height={48} style={{ objectFit: 'contain' }} />
            <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={26} color="#111" />
            </button>
          </div>
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} className="mobile-menu-link" onClick={() => setMenuOpen(false)}>{l.label}</Link>
          ))}
          <div style={{ height: 1, background: '#f0f0f0', margin: '16px 0' }} />
          {PILLS.map(p => (
            <Link key={p.href} href={p.href} className="mobile-menu-link" onClick={() => setMenuOpen(false)} style={{ fontSize: 15, color: '#333' }}>{p.label}</Link>
          ))}
          <div style={{ height: 1, background: '#f0f0f0', margin: '16px 0' }} />
          <Link href="/contact" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>צור קשר</Link>
          <Link href="/about" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>אודות</Link>
        </div>
      )}
    </header>
  );
}
