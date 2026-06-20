'use client'
import LogoutButton from './LogoutButton'

interface Props {
  title: string; search: string
  onSearch: (v: string) => void
  onImport: () => void; onAddProduct: () => void
}

export default function Topbar({ title, search, onSearch, onImport, onAddProduct }: Props) {
  return (
    <div className="admin-topbar">
      <span className="admin-topbar-title">{title}</span>
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
