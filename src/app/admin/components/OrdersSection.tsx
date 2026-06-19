'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function OrdersSection() {
  const [orders, setOrders] = useState<any[]>(DEMO_ORDERS)

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    
    const { data } = await supabase
      .from('orders')
      .select('id,created_at,status,total,customer_name,items_count')
      .order('created_at', { ascending: false })
      .limit(50)
    if (data && data.length > 0) setOrders(data)
  }

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      approved: 'status-ok',   confirmed: 'status-ok',
      processing: 'status-low', shipped: 'status-ok',
      pending: 'status-wait',   cancelled: 'status-out',
    }
    const labels: Record<string, string> = {
      approved: 'אושר', confirmed: 'אושר',
      processing: 'בטיפול', shipped: 'נשלח',
      pending: 'ממתין', cancelled: 'בוטל',
    }
    const cls = map[status] ?? 'status-wait'
    return <span className={`status-badge ${cls}`}>{labels[status] ?? status}</span>
  }

  return (
    <>
      <div className="metrics-grid">
        <div className="metric-card"><div className="metric-label">הזמנות היום</div><div className="metric-val">14</div></div>
        <div className="metric-card"><div className="metric-label">ממוצע סל</div><div className="metric-val">₪347</div></div>
        <div className="metric-card"><div className="metric-label delta-warn">ממתינות לאישור</div><div className="metric-val" style={{ color:'#BA7517' }}>3</div></div>
        <div className="metric-card"><div className="metric-label">הכנסה היום</div><div className="metric-val">₪4,858</div><div className="metric-delta delta-up">↑ +18% לעומת אתמול</div></div>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #e8e8e8' }}>
          <span className="admin-card-title">כל ההזמנות</span>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ padding: '10px 16px' }}>#</th>
              <th>לקוח</th>
              <th>סכום</th>
              <th>פריטים</th>
              <th>סטטוס</th>
              <th>תאריך</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td style={{ padding: '10px 16px' }} className="td-mono">#{o.id}</td>
                <td className="td-bold">{o.customer_name}</td>
                <td>₪{(o.total ?? 0).toLocaleString()}</td>
                <td>{o.items_count ?? '—'}</td>
                <td>{statusBadge(o.status)}</td>
                <td style={{ fontSize: 12, color: '#888' }}>{formatDate(o.created_at)}</td>
                <td><button className="admin-card-action">👁</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function formatDate(iso: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 86400000) return 'היום ' + d.toTimeString().slice(0,5)
  if (diff < 172800000) return 'אתמול ' + d.toTimeString().slice(0,5)
  return d.toLocaleDateString('he-IL')
}

const DEMO_ORDERS = [
  { id:'1024', customer_name:'ישראל ישראלי', total:892,  items_count:4, status:'approved',   created_at: new Date(Date.now()-3600000).toISOString() },
  { id:'1023', customer_name:'שרה כהן',       total:234,  items_count:1, status:'processing', created_at: new Date(Date.now()-7200000).toISOString() },
  { id:'1022', customer_name:'דוד לוי',       total:1450, items_count:7, status:'shipped',    created_at: new Date(Date.now()-86400000).toISOString() },
  { id:'1021', customer_name:'מיכל ברק',      total:178,  items_count:2, status:'pending',    created_at: new Date(Date.now()-90000000).toISOString() },
  { id:'1020', customer_name:'אבי כהן',       total:520,  items_count:3, status:'approved',   created_at: new Date(Date.now()-172800000).toISOString() },
]
