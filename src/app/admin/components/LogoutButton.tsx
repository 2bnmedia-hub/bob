'use client'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LogoutButton() {
  const router = useRouter()
  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }
  return (
    <button onClick={handleLogout} className="btn-admin" style={{ border:'1px solid #f7c1c1', background:'#FCEBEB', color:'#A32D2D' }}>
      🚪 התנתק
    </button>
  )
}
