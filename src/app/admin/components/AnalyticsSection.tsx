'use client'

import { useEffect, useRef } from 'react'

declare const Chart: any

export default function AnalyticsSection() {
  const revenueRef  = useRef<HTMLCanvasElement>(null)
  const pieRef      = useRef<HTMLCanvasElement>(null)
  const trendRef    = useRef<HTMLCanvasElement>(null)
  const importRef   = useRef<HTMLCanvasElement>(null)
  const chartsRef   = useRef<any[]>([])

  useEffect(() => {
    const timer = setTimeout(initCharts, 100)
    return () => {
      clearTimeout(timer)
      chartsRef.current.forEach(c => c?.destroy())
      chartsRef.current = []
    }
  }, [])

  function initCharts() {
    if (typeof Chart === 'undefined') return
    chartsRef.current.forEach(c => c?.destroy())
    chartsRef.current = []

    const tickStyle = { font: { size: 10 }, color: '#888' }
    const gridColor = 'rgba(0,0,0,0.05)'

    // Weekly revenue bar
    if (revenueRef.current) {
      chartsRef.current.push(new Chart(revenueRef.current, {
        type: 'bar',
        data: {
          labels: ['שב׳ 1','שב׳ 2','שב׳ 3','שב׳ 4','שב׳ 5','שב׳ 6','שב׳ 7','שב׳ 8'],
          datasets: [{
            label: 'הכנסה (₪)',
            data: [18400,22100,19800,25300,21700,28900,24100,31200],
            backgroundColor: (_: any, i: number) => i === 7 ? '#F0C040' : '#2D6A4F',
            borderRadius: 5, borderSkipped: false,
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: tickStyle, grid: { display: false } },
            y: {
              ticks: { ...tickStyle, callback: (v: number) => '₪' + Math.round(v / 1000) + 'K' },
              grid: { color: gridColor }, beginAtZero: true
            }
          }
        }
      }))
    }

    // Sales by category pie
    if (pieRef.current) {
      chartsRef.current.push(new Chart(pieRef.current, {
        type: 'pie',
        data: {
          labels: ['חשמל','אינסטלציה','כלי עבודה','בניין ושיפוץ','אחר'],
          datasets: [{
            data: [31,24,19,15,11],
            backgroundColor: ['#2D6A4F','#F0C040','#378ADD','#E24B4A','#888780'],
            borderWidth: 2, borderColor: '#fff', hoverOffset: 8,
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      }))
    }

    // New products vs stock updates trend line
    if (trendRef.current) {
      chartsRef.current.push(new Chart(trendRef.current, {
        type: 'line',
        data: {
          labels: ['ינואר','פברואר','מרץ','אפריל','מאי','יוני'],
          datasets: [
            {
              label: 'מוצרים חדשים',
              data: [45,62,58,81,74,93],
              borderColor: '#2D6A4F', backgroundColor: 'rgba(45,106,79,0.08)',
              borderWidth: 2, fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#2D6A4F',
            },
            {
              label: 'עדכוני מלאי',
              data: [120,145,138,189,167,210],
              borderColor: '#F0C040', backgroundColor: 'rgba(240,192,64,0.06)',
              borderWidth: 2, fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#F0C040',
              borderDash: [5,3],
            }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true, position: 'top',
              labels: { font: { size: 11 }, color: '#555', boxWidth: 12, padding: 16 }
            }
          },
          scales: {
            x: { ticks: tickStyle, grid: { color: gridColor } },
            y: { ticks: tickStyle, grid: { color: gridColor }, beginAtZero: true }
          }
        }
      }))
    }

    // Import history bar
    if (importRef.current) {
      chartsRef.current.push(new Chart(importRef.current, {
        type: 'bar',
        data: {
          labels: ['ינואר','פברואר','מרץ','אפריל','מאי','יוני'],
          datasets: [
            {
              label: 'יובאו בהצלחה',
              data: [480,620,310,840,590,720],
              backgroundColor: '#2D6A4F', borderRadius: 4, borderSkipped: false,
            },
            {
              label: 'שגיאות',
              data: [12,5,23,3,8,2],
              backgroundColor: '#E24B4A', borderRadius: 4, borderSkipped: false,
            }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true, position: 'top',
              labels: { font: { size: 11 }, color: '#555', boxWidth: 12, padding: 16 }
            }
          },
          scales: {
            x: { ticks: tickStyle, grid: { display: false } },
            y: { ticks: tickStyle, grid: { color: gridColor }, beginAtZero: true, stacked: false }
          }
        }
      }))
    }
  }

  return (
    <>
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">הכנסה החודש</div>
          <div className="metric-val">₪84,230</div>
          <div className="metric-delta delta-up">↑ +12% לעומת חודש קודם</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">הזמנות החודש</div>
          <div className="metric-val">243</div>
          <div className="metric-delta delta-up">↑ +31 לעומת קודם</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">ממוצע סל</div>
          <div className="metric-val">₪347</div>
          <div className="metric-delta delta-down">↓ ‑₪12 לעומת קודם</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">לקוחות חוזרים</div>
          <div className="metric-val">68%</div>
          <div className="metric-delta delta-up">↑ +4% לעומת קודם</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">הכנסה שבועית — 8 שבועות</span>
            <span style={{ fontSize: 11, color: '#888' }}>שבוע נוכחי מודגש בזהב</span>
          </div>
          <div style={{ position: 'relative', height: 200 }}>
            <canvas ref={revenueRef} role="img" aria-label="גרף הכנסה שבועית" />
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">התפלגות מכירות לפי קטגוריה</span>
          </div>
          <div className="chart-legend">
            {[
              ['#2D6A4F','חשמל 31%'],['#F0C040','אינסטלציה 24%'],
              ['#378ADD','כלי עבודה 19%'],['#E24B4A','בניין 15%'],['#888780','אחר 11%']
            ].map(([color, label]) => (
              <span key={label} className="legend-item">
                <span className="legend-sq" style={{ background: color }}/>
                {label}
              </span>
            ))}
          </div>
          <div style={{ position: 'relative', height: 170 }}>
            <canvas ref={pieRef} role="img" aria-label="עוגת מכירות לפי קטגוריה" />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">מגמת מוצרים חדשים לעומת עדכוני מלאי</span>
        </div>
        <div style={{ position: 'relative', height: 160 }}>
          <canvas ref={trendRef} role="img" aria-label="גרף מגמת מוצרים" />
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">היסטוריית ייבוא קבצים — 6 חודשים</span>
        </div>
        <div style={{ position: 'relative', height: 160 }}>
          <canvas ref={importRef} role="img" aria-label="גרף היסטוריית ייבוא" />
        </div>
      </div>
    </>
  )
}
