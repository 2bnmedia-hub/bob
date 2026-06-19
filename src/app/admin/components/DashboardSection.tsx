'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

// Chart.js loaded via CDN in layout — types only
declare const Chart: any

interface Stats {
  totalProducts: number
  totalCategories: number
  lowStock: number
  openOrders: number
}

export default function DashboardSection() {
  const salesRef  = useRef<HTMLCanvasElement>(null)
  const donutRef  = useRef<HTMLCanvasElement>(null)
  const ordDonut  = useRef<HTMLCanvasElement>(null)
  const catRef    = useRef<HTMLCanvasElement>(null)
  const chartsRef = useRef<any[]>([])

  const [stats, setStats] = useState<Stats>({
    totalProducts: 0, totalCategories: 0, lowStock: 0, openOrders: 0
  })
  const [recentProducts, setRecentProducts] = useState<any[]>([])
  const [topCategories, setTopCategories]   = useState<any[]>([])
  const [period, setPeriod] = useState<'monthly' | 'weekly'>('monthly')

  useEffect(() => {
    loadStats()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => initCharts(), 100)
    return () => {
      clearTimeout(timer)
      chartsRef.current.forEach(c => c?.destroy())
      chartsRef.current = []
    }
  }, [period])

  async function loadStats() {
    

    const [
      { count: prodCount },
      { count: catCount },
      { count: lowCount },
      { count: orderCount },
      { data: recent },
      { data: cats },
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }).lt('stock', 10).gt('stock', 0),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('products').select('id,name,category,price,stock').order('created_at', { ascending: false }).limit(5),
      supabase.from('categories').select('id,name,slug').limit(8),
    ])

    setStats({
      totalProducts:  prodCount  ?? 0,
      totalCategories: catCount  ?? 0,
      lowStock:        lowCount  ?? 0,
      openOrders:      orderCount ?? 0,
    })
    setRecentProducts(recent ?? [])
    setTopCategories(cats ?? [])
  }

  function initCharts() {
    if (typeof Chart === 'undefined') return

    chartsRef.current.forEach(c => c?.destroy())
    chartsRef.current = []

    const monthLabels = ['יול','אוג','ספט','אוק','נוב','דצמ','ינו','פבר','מרץ','אפר','מאי','יוני']
    const weekLabels  = ['שב׳ 1','שב׳ 2','שב׳ 3','שב׳ 4','שב׳ 5','שב׳ 6','שב׳ 7','שב׳ 8']
    const salesData   = period === 'monthly'
      ? [52,68,74,61,88,95,70,83,91,78,104,112]
      : [18400,22100,19800,25300,21700,28900,24100,31200]

    // Sales line chart
    if (salesRef.current) {
      chartsRef.current.push(new Chart(salesRef.current, {
        type: 'line',
        data: {
          labels: period === 'monthly' ? monthLabels : weekLabels,
          datasets: [{
            label: 'מכירות',
            data: salesData,
            borderColor: '#2D6A4F',
            backgroundColor: 'rgba(45,106,79,0.08)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: '#2D6A4F',
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { font: { size: 10 }, color: '#888' }, grid: { color: 'rgba(0,0,0,0.05)' } },
            y: { ticks: { font: { size: 10 }, color: '#888' }, grid: { color: 'rgba(0,0,0,0.05)' }, beginAtZero: true },
          }
        }
      }))
    }

    // Stock donut
    if (donutRef.current) {
      chartsRef.current.push(new Chart(donutRef.current, {
        type: 'doughnut',
        data: {
          labels: ['תקין','נמוך','אזל'],
          datasets: [{ data: [92,5,3], backgroundColor: ['#2D6A4F','#EF9F27','#E24B4A'], borderWidth: 0, hoverOffset: 4 }]
        },
        options: { responsive: true, maintainAspectRatio: false, cutout: '68%', plugins: { legend: { display: false } } }
      }))
    }

    // Orders donut
    if (ordDonut.current) {
      chartsRef.current.push(new Chart(ordDonut.current, {
        type: 'doughnut',
        data: {
          labels: ['אושר','בטיפול','ממתין'],
          datasets: [{ data: [8,4,2], backgroundColor: ['#2D6A4F','#EF9F27','#E24B4A'], borderWidth: 0, hoverOffset: 4 }]
        },
        options: { responsive: true, maintainAspectRatio: false, cutout: '68%', plugins: { legend: { display: false } } }
      }))
    }

    // Category bar
    if (catRef.current) {
      chartsRef.current.push(new Chart(catRef.current, {
        type: 'bar',
        data: {
          labels: topCategories.map(c => c.name) || ['חשמל','אינסטלציה','כלי עבודה','בניין','גז','כיתיים','איטום','שלטים'],
          datasets: [{
            label: 'מוצרים',
            data: [641,531,422,328,218,156,109,78],
            backgroundColor: '#2D6A4F', borderRadius: 4, borderSkipped: false,
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { font: { size: 9 }, color: '#888' }, grid: { display: false } },
            y: { ticks: { font: { size: 9 }, color: '#888' }, grid: { color: 'rgba(0,0,0,0.05)' }, beginAtZero: true },
          }
        }
      }))
    }
  }

  const statusLabel = (stock: number) => {
    if (stock === 0)  return <span className="status-badge status-out">אזל</span>
    if (stock < 10)   return <span className="status-badge status-low">נמוך</span>
    return               <span className="status-badge status-ok">פעיל</span>
  }

  return (
    <>
      {/* Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">מוצרים פעילים</div>
          <div className="metric-val">{stats.totalProducts.toLocaleString()}</div>
          <div className="metric-delta delta-up">↑ +128 החודש</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">קטגוריות</div>
          <div className="metric-val">{stats.totalCategories}</div>
          <div className="metric-delta delta-up">↑ +3 חדשות</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">מלאי נמוך</div>
          <div className="metric-val delta-warn">{stats.lowStock}</div>
          <div className="metric-delta delta-down">⚠ דורשים תשומת לב</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">הזמנות פתוחות</div>
          <div className="metric-val">{stats.openOrders}</div>
          <div className="metric-delta delta-up">3 ממתינות לאישור</div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid-3">
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">מכירות — 12 חודשים</span>
            <div className="period-tabs">
              <button className={`period-tab${period === 'monthly' ? ' active' : ''}`} onClick={() => setPeriod('monthly')}>חודשי</button>
              <button className={`period-tab${period === 'weekly'  ? ' active' : ''}`} onClick={() => setPeriod('weekly')}>שבועי</button>
            </div>
          </div>
          <div style={{ position: 'relative', height: 160 }}>
            <canvas ref={salesRef} role="img" aria-label="גרף מכירות" />
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">מצב מלאי</span></div>
          <div className="chart-legend">
            <span className="legend-item"><span className="legend-sq" style={{ background:'#2D6A4F' }}/>תקין 92%</span>
            <span className="legend-item"><span className="legend-sq" style={{ background:'#EF9F27' }}/>נמוך 5%</span>
            <span className="legend-item"><span className="legend-sq" style={{ background:'#E24B4A' }}/>אזל 3%</span>
          </div>
          <div style={{ position: 'relative', height: 120 }}>
            <canvas ref={donutRef} role="img" aria-label="עוגת מצב מלאי" />
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">הזמנות לפי סטטוס</span></div>
          <div className="chart-legend">
            <span className="legend-item"><span className="legend-sq" style={{ background:'#2D6A4F' }}/>אושר</span>
            <span className="legend-item"><span className="legend-sq" style={{ background:'#EF9F27' }}/>בטיפול</span>
            <span className="legend-item"><span className="legend-sq" style={{ background:'#E24B4A' }}/>ממתין</span>
          </div>
          <div style={{ position: 'relative', height: 120 }}>
            <canvas ref={ordDonut} role="img" aria-label="עוגת הזמנות" />
          </div>
        </div>
      </div>

      {/* Products + cat bar */}
      <div className="grid-auto">
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">מוצרים אחרונים שנוספו</span>
          </div>
          <table className="admin-table">
            <thead>
              <tr><th>שם מוצר</th><th>קטגוריה</th><th>מחיר</th><th>מלאי</th><th>סטטוס</th></tr>
            </thead>
            <tbody>
              {recentProducts.length > 0
                ? recentProducts.map(p => (
                  <tr key={p.id}>
                    <td className="td-bold">{p.name}</td>
                    <td>{p.category}</td>
                    <td>₪{p.price}</td>
                    <td>{p.stock}</td>
                    <td>{statusLabel(p.stock)}</td>
                  </tr>
                ))
                : DEMO_PRODUCTS.map(p => (
                  <tr key={p.id}>
                    <td className="td-bold">{p.name}</td>
                    <td>{p.cat}</td>
                    <td>₪{p.price}</td>
                    <td>{p.stock}</td>
                    <td>{statusLabel(p.stock)}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">קטגוריות מובילות</span></div>
          <div style={{ position: 'relative', height: 200 }}>
            <canvas ref={catRef} role="img" aria-label="גרף קטגוריות" />
          </div>
        </div>
      </div>
    </>
  )
}

const DEMO_PRODUCTS = [
  { id:1, name:'מרסס חשמלי 650W', cat:'חשמל', price:349, stock:23 },
  { id:2, name:'מסור עגול 185mm',  cat:'כלי עבודה', price:289, stock:8 },
  { id:3, name:'צינור PP-R 20mm',  cat:'אינסטלציה', price:12, stock:0 },
  { id:4, name:'פנס LED 10W',      cat:'חשמל', price:45, stock:104 },
  { id:5, name:'מנעול 3 נקודות',  cat:'כיתיים', price:210, stock:31 },
]
