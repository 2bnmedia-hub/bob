'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

declare const Chart: any

export default function CategoriesSection() {
  const barRef    = useRef<HTMLCanvasElement>(null)
  const chartRef  = useRef<any>(null)
  const [cats, setCats] = useState<any[]>(DEMO_CATS)

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    const timer = setTimeout(initChart, 100)
    return () => { clearTimeout(timer); chartRef.current?.destroy() }
  }, [cats])

  async function loadCategories() {
    
    const { data } = await supabase.from('categories').select('*').order('name')
    if (data && data.length > 0) setCats(data)
  }

  function initChart() {
    if (typeof Chart === 'undefined' || !barRef.current) return
    chartRef.current?.destroy()
    chartRef.current = new Chart(barRef.current, {
      type: 'bar',
      data: {
        labels: cats.map(c => c.name),
        datasets: [{
          label: 'מוצרים',
          data: cats.map(c => c.product_count ?? Math.floor(Math.random() * 600 + 50)),
          backgroundColor: cats.map((_, i) => i < 3 ? '#2D6A4F' : i < 5 ? '#F0C040' : '#C8DDD4'),
          borderRadius: 5, borderSkipped: false,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { font: { size: 10 }, color: '#888' }, grid: { color: 'rgba(0,0,0,0.05)' }, beginAtZero: true },
          y: { ticks: { font: { size: 11 }, color: '#333' }, grid: { display: false } },
        }
      }
    })
  }

  return (
    <>
      <div className="metrics-grid cols-3">
        <div className="metric-card">
          <div className="metric-label">סה"כ קטגוריות</div>
          <div className="metric-val">{cats.length}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">תת-קטגוריות</div>
          <div className="metric-val">127</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">ממוצע מוצרים לקטגוריה</div>
          <div className="metric-val">83</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">מוצרים לפי קטגוריה</span>
          </div>
          <div style={{ position: 'relative', height: Math.max(cats.length * 36 + 40, 200) }}>
            <canvas ref={barRef} role="img" aria-label="גרף אופקי קטגוריות" />
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">כל הקטגוריות</span>
            <button className="btn-admin primary" style={{ fontSize: 12, padding: '5px 10px' }}>+ הוסף קטגוריה</button>
          </div>
          <table className="admin-table">
            <thead>
              <tr><th>שם</th><th>Slug</th><th>מוצרים</th><th>פעיל</th></tr>
            </thead>
            <tbody>
              {cats.map(c => (
                <tr key={c.id ?? c.slug}>
                  <td className="td-bold">{c.name}</td>
                  <td className="td-mono">{c.slug}</td>
                  <td>{c.product_count ?? '—'}</td>
                  <td><span className="status-badge status-ok">כן</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

const DEMO_CATS = [
  { id:'1', name:'חשמל', slug:'electric', product_count:641 },
  { id:'2', name:'מכשירי חשמל', slug:'appliances', product_count:531 },
  { id:'3', name:'אינסטלציה', slug:'plumbing', product_count:422 },
  { id:'4', name:'חומרי איטום', slug:'sealing', product_count:328 },
  { id:'5', name:'גז', slug:'gas', product_count:218 },
  { id:'6', name:'כיתיים', slug:'locks', product_count:156 },
  { id:'7', name:'שכפול מפתחות', slug:'keys', product_count:109 },
  { id:'8', name:'קידוד שלטים', slug:'remotes', product_count:78 },
]
