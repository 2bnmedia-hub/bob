'use client'

import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'

interface Product {
  id: string
  name: string
  slug: string
  category: string
  price: number
  stock: number
  sku?: string
  image_url?: string
  created_at?: string
}

type StockFilter = 'all' | 'low' | 'out'

export default function ProductsSection({ search }: { search: string }) {
  const [products, setProducts]     = useState<Product[]>([])
  const [loading, setLoading]       = useState(true)
  const [stockFilter, setStockFilter] = useState<StockFilter>('all')
  const [sortBy, setSortBy]         = useState<'name' | 'price' | 'stock'>('name')
  const [page, setPage]             = useState(0)
  const PAGE_SIZE = 20

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    setLoading(true)
    
    const { data } = await supabase
      .from('products')
      .select('id,name,slug,category,price,stock,sku,image_url,created_at')
      .order('created_at', { ascending: false })
    setProducts(data ?? DEMO_PRODUCTS)
    setLoading(false)
  }

  const filtered = useMemo(() => {
    let list = products
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q)
      )
    }
    if (stockFilter === 'low') list = list.filter(p => p.stock > 0 && p.stock < 10)
    if (stockFilter === 'out') list = list.filter(p => p.stock === 0)

    list = [...list].sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price
      if (sortBy === 'stock') return a.stock - b.stock
      return a.name.localeCompare(b.name, 'he')
    })
    return list
  }, [products, search, stockFilter, sortBy])

  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

  const statusBadge = (stock: number) => {
    if (stock === 0) return <span className="status-badge status-out">אזל המלאי</span>
    if (stock < 10)  return <span className="status-badge status-low">מלאי נמוך</span>
    return <span className="status-badge status-ok">פעיל</span>
  }

  return (
    <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', gap: 10, direction: 'rtl' }}>
        <div className="filter-tabs" style={{ borderBottom: 'none', marginBottom: 0, flex: 1 }}>
          {(['all','low','out'] as StockFilter[]).map(f => (
            <button key={f} className={`filter-tab${stockFilter === f ? ' active' : ''}`}
              onClick={() => { setStockFilter(f); setPage(0) }}>
              {{ all: 'כל המוצרים', low: 'מלאי נמוך', out: 'אזל המלאי' }[f]}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 12, color: '#888' }}>{filtered.length} מוצרים</span>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as any)}
          style={{ fontSize: 12, padding: '5px 8px', border: '1px solid #ddd', borderRadius: 6, color: '#555', background: '#fff' }}
        >
          <option value="name">מיון: שם</option>
          <option value="price">מיון: מחיר</option>
          <option value="stock">מיון: מלאי</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#888', fontSize: 13 }}>טוען מוצרים...</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ padding: '10px 16px' }}>שם מוצר</th>
              <th>קטגוריה</th>
              <th>מק"ט</th>
              <th>מחיר</th>
              <th>מלאי</th>
              <th>סטטוס</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(p => (
              <tr key={p.id}>
                <td style={{ padding: '10px 16px' }} className="td-bold">{p.name}</td>
                <td>{p.category}</td>
                <td className="td-mono">{p.sku || p.slug}</td>
                <td>₪{p.price.toLocaleString()}</td>
                <td style={{ fontWeight: p.stock < 10 ? 600 : 400, color: p.stock === 0 ? '#A32D2D' : p.stock < 10 ? '#854F0B' : '#111' }}>
                  {p.stock}
                </td>
                <td>{statusBadge(p.stock)}</td>
                <td>
                  <button className="admin-card-action" title="עריכה">✏️</button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: '#888', padding: 32 }}>לא נמצאו מוצרים</td></tr>
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ padding: '12px 16px', borderTop: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', gap: 8, direction: 'rtl', fontSize: 12, color: '#555' }}>
          <button className="btn-admin" style={{ padding: '4px 10px', fontSize: 12 }}
            disabled={page === 0} onClick={() => setPage(p => p - 1)}>→ הקודם</button>
          <span style={{ flex: 1, textAlign: 'center' }}>
            עמוד {page + 1} מתוך {totalPages}
          </span>
          <button className="btn-admin" style={{ padding: '4px 10px', fontSize: 12 }}
            disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>הבא ←</button>
        </div>
      )}
    </div>
  )
}

const DEMO_PRODUCTS: Product[] = [
  { id:'1', name:'מרסס חשמלי 650W', slug:'electric-sprayer-650w', category:'חשמל', price:349, stock:23, sku:'EL-651' },
  { id:'2', name:'מסור עגול 185mm',  slug:'circular-saw-185',      category:'כלי עבודה', price:289, stock:8, sku:'TW-185' },
  { id:'3', name:'צינור PP-R 20mm',  slug:'ppr-pipe-20mm',         category:'אינסטלציה', price:12, stock:0, sku:'PL-020' },
  { id:'4', name:'פנס LED 10W',      slug:'led-light-10w',         category:'חשמל', price:45, stock:104, sku:'EL-010' },
  { id:'5', name:'מנעול 3 נקודות',  slug:'lock-3-points',         category:'כיתיים', price:210, stock:31, sku:'LK-300' },
  { id:'6', name:'ברז מינקי 1/2"',  slug:'mini-tap-half',         category:'אינסטלציה', price:38, stock:5, sku:'PL-121' },
  { id:'7', name:'כבל ניילון 3mm',  slug:'nylon-cable-3mm',       category:'חשמל', price:89, stock:67, sku:'EL-350' },
  { id:'8', name:'סיליקון אקרילי',  slug:'acrylic-silicone',      category:'איטום', price:24, stock:0, sku:'SE-010' },
  { id:'9', name:'מפסק לחצן 10A',  slug:'button-switch-10a',     category:'חשמל', price:18, stock:2, sku:'EL-010B' },
  { id:'10', name:'שלט Universal', slug:'remote-universal',       category:'שלטים', price:55, stock:44, sku:'RM-UNI' },
]
