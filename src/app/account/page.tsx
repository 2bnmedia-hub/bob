'use client';
import { useState } from 'react';
import { User, Mail, Phone, Lock } from 'lucide-react';

export default function AccountPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '' });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert(tab === 'login' ? 'התחברות בקרוב...' : 'הרשמה בקרוב...');
  }

  return (
    <main style={{ direction: 'rtl', padding: '64px 0', minHeight: '70vh', background: 'var(--gray-50)' }}>
      <div style={{ maxWidth: 440, margin: '0 auto', padding: '0 16px' }}>

        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, background: 'var(--cream)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <User size={28} strokeWidth={1.8} color="var(--brown)" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#111' }}>
            {tab === 'login' ? 'כניסה לחשבון' : 'יצירת חשבון'}
          </h1>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', background: 'var(--gray-100)', borderRadius: 12, padding: 4, marginBottom: 28 }}>
          {[['login','כניסה'],['register','הרשמה']].map(([t, l]) => (
            <button key={t} onClick={() => setTab(t as any)} style={{ flex: 1, padding: '10px 0', fontSize: 14, fontWeight: 700, border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'var(--font)', background: tab === t ? '#fff' : 'transparent', color: tab === t ? 'var(--brown-dark)' : 'var(--gray-600)', boxShadow: tab === t ? '0 2px 8px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s' }}>{l}</button>
          ))}
        </div>

        {/* FORM */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {tab === 'register' && (
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 6 }}>שם מלא</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }} color="var(--gray-400)" />
                  <input type="text" required placeholder="ישראל ישראלי" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    style={{ width: '100%', border: '1.5px solid var(--gray-200)', borderRadius: 10, padding: '11px 40px 11px 14px', fontSize: 15, fontFamily: 'var(--font)', outline: 'none', direction: 'rtl' }} />
                </div>
              </div>
            )}

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 6 }}>אימייל</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }} color="var(--gray-400)" />
                <input type="email" required placeholder="example@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  style={{ width: '100%', border: '1.5px solid var(--gray-200)', borderRadius: 10, padding: '11px 40px 11px 14px', fontSize: 15, fontFamily: 'var(--font)', outline: 'none', direction: 'rtl' }} />
              </div>
            </div>

            {tab === 'register' && (
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 6 }}>טלפון</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }} color="var(--gray-400)" />
                  <input type="tel" placeholder="050-000-0000" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    style={{ width: '100%', border: '1.5px solid var(--gray-200)', borderRadius: 10, padding: '11px 40px 11px 14px', fontSize: 15, fontFamily: 'var(--font)', outline: 'none', direction: 'rtl' }} />
                </div>
              </div>
            )}

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 6 }}>סיסמה</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }} color="var(--gray-400)" />
                <input type="password" required placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  style={{ width: '100%', border: '1.5px solid var(--gray-200)', borderRadius: 10, padding: '11px 40px 11px 14px', fontSize: 15, fontFamily: 'var(--font)', outline: 'none', direction: 'rtl' }} />
              </div>
            </div>

            {tab === 'login' && (
              <div style={{ textAlign: 'left' }}>
                <a href="#" style={{ fontSize: 13, color: '#222', textDecoration: 'underline' }}>שכחת סיסמה?</a>
              </div>
            )}

            <button type="submit" style={{ background: 'var(--brown)', color: 'var(--gold)', border: 'none', fontWeight: 700, fontSize: 16, padding: '13px 0', borderRadius: 10, cursor: 'pointer', fontFamily: 'var(--font)', marginTop: 8 }}>
              {tab === 'login' ? 'כניסה' : 'יצירת חשבון'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
