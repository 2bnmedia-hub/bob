'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabaseAuth = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabaseAuth.auth.signInWithPassword({ email, password })
    if (error) { setError('אימייל או סיסמה שגויים: ' + error.message); setLoading(false); return }
    router.push('/admin')
    router.refresh()
  }

  return (
    <div style={{ minHeight:'100vh', background:'#F5F5F5', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Open Sans', sans-serif", direction:'rtl' }}>
      <div style={{ background:'#fff', borderRadius:14, padding:'40px 36px', width:380, boxShadow:'0 4px 24px rgba(0,0,0,0.08)', border:'1px solid #e8e8e8' }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:48, height:48, background:'#2D6A4F', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', fontSize:22 }}>🏠</div>
          <div style={{ fontSize:20, fontWeight:700, color:'#111' }}>בוב חומרי בניין</div>
          <div style={{ fontSize:13, color:'#888', marginTop:4 }}>כניסה למנהל מערכת</div>
        </div>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#444', marginBottom:6 }}>אימייל</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@example.com" required
              style={{ width:'100%', padding:'10px 12px', border:'1px solid #ddd', borderRadius:8, fontSize:14, color:'#111', background:'#fafafa', outline:'none', boxSizing:'border-box' }} />
          </div>
          <div style={{ marginBottom:24 }}>
            <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#444', marginBottom:6 }}>סיסמה</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required
              style={{ width:'100%', padding:'10px 12px', border:'1px solid #ddd', borderRadius:8, fontSize:14, color:'#111', background:'#fafafa', outline:'none', boxSizing:'border-box' }} />
          </div>
          {error && (
            <div style={{ background:'#FCEBEB', color:'#A32D2D', borderRadius:8, padding:'10px 14px', fontSize:13, marginBottom:16, border:'1px solid #f7c1c1' }}>
              ❌ {error}
            </div>
          )}
          <button type="submit" disabled={loading}
            style={{ width:'100%', padding:11, background:loading?'#7aab94':'#2D6A4F', color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor:loading?'not-allowed':'pointer' }}>
            {loading ? 'מתחבר...' : 'כניסה לפאנל'}
          </button>
        </form>
        <div style={{ textAlign:'center', marginTop:20, fontSize:12, color:'#bbb' }}>גישה מורשית בלבד</div>
      </div>
    </div>
  )
}
