'use client'
import { usePathname } from 'next/navigation'
import LogoutButton from './LogoutButton'

interface Props {
  title: string; search: string
  onSearch: (v: string) => void
  onImport: () => void; onAddProduct: () => void
}

export default function Topbar({ title, search, onSearch, onImport, onAddProduct }: Props) {
  return (
    <div className="admin-topbar">
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span className="admin-topbar-title">{title}</span>
        <span style={{ fontSize: 11, color: "#aaa", fontFamily: "monospace" }}>{typeof window !== "undefined" ? window.location.pathname : ""}</span>
      </div>
      <div className="admin-search-wrap">
        <input type="text" placeholder="חיפוש מוצר, קטגוריה, מק״ט..." value={search} onChange={e => onSearch(e.target.value)} />
        <span className="search-icon">🔍</span>
      </div>
      <button className="btn-admin primary" onClick={onImport}>⬆️ ייבוא קובץ</button>
      <button className="btn-admin" onClick={onAddProduct}>＋ מוצר חדש</button>
      <LogoutButton />
    </div>
  )
}
