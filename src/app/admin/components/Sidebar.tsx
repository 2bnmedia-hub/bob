'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Section } from '../page'

interface Props {
  active: Section
  onNav: (s: Section) => void
  onImport: () => void
}

export default function Sidebar({ active, onNav, onImport }: Props) {
  const [email, setEmail] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email)
    })
  }, [])

  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <div className="admin-logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F0C040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <div>
          <div className="admin-logo-text">{email || 'בוב'}</div>
          <div className="admin-logo-sub">לוח בקרה</div>
        </div>
      </div>

      <nav className="admin-nav">
        <div className="admin-nav-section">כללי</div>
        <NavItem icon="📊" label="סקירה כללית" active={active === 'dashboard'} onClick={() => onNav('dashboard')} />
        <NavItem icon="🏠" label="ניהול דף הבית" active={active === 'homepage'} onClick={() => onNav('homepage')} />
        <NavItem icon="📦" label="מוצרים" badge="2,841" active={active === 'products'} onClick={() => onNav('products')} />
        <NavItem icon="🗂️" label="קטגוריות" active={active === 'categories'} onClick={() => onNav('categories')} />
        <NavItem icon="📈" label="אנליטיקס" active={active === 'analytics'} onClick={() => onNav('analytics')} />
        <NavItem icon="⬆️" label="ייבוא קובץ" onClick={onImport} />

        <div className="admin-nav-section">מכירות</div>
        <NavItem icon="🛒" label="הזמנות" badge="14" active={active === 'orders'} onClick={() => onNav('orders')} />
        <NavItem icon="👥" label="לקוחות" onClick={() => {}} />

        <div className="admin-nav-section">מערכת</div>
        <NavItem icon="⚙️" label="הגדרות" onClick={() => {}} />
        <NavItem icon="🗄️" label="Supabase" onClick={() => {}} />
      </nav>
    </aside>
  )
}

function NavItem({ icon, label, badge, active, onClick }: {
  icon: string; label: string; badge?: string; active?: boolean; onClick: () => void
}) {
  return (
    <button className={`admin-nav-item${active ? ' active' : ''}`} onClick={onClick}>
      <span>{icon}</span>
      <span>{label}</span>
      {badge && <span className="admin-nav-badge">{badge}</span>}
    </button>
  )
}
