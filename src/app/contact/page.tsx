'use client';
import { useState } from 'react';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <main style={{ direction: 'rtl', padding: '64px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: 36, fontWeight: 900, color: '#111', marginBottom: 8, textAlign: 'center' }}>צור קשר</h1>
        <p style={{ textAlign: 'center', color: 'var(--gray-600)', marginBottom: 48 }}>נשמח לשמוע ממך</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          {/* INFO */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              [MapPin, 'כתובת', 'קריית ים, ישראל'],
              [Phone, 'טלפון', '055-999-8088'],
              [Mail, 'אימייל', 'info@bob-hardware.co.il'],
              [Clock, 'שעות פתיחה', 'ראשון–חמישי 07:00–19:00 | שישי 07:00–14:00'],
            ].map(([Icon, title, val]: any) => (
              <div key={title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ background: 'var(--cream)', borderRadius: 12, padding: 14, flexShrink: 0 }}>
                  <Icon size={22} strokeWidth={1.8} color="var(--brown)" />
                </div>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-800)' }}>{val}</div>
                </div>
              </div>
            ))}
          </div>

          {/* FORM */}
          {sent ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: 'var(--cream)', borderRadius: 20, padding: 48 }}>
              <div style={{ fontSize: 48 }}>✓</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#222' }}>הודעתך נשלחה!</h2>
              <p style={{ color: 'var(--gray-600)' }}>נחזור אליך בהקדם</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[['name','שם מלא','text'],['email','אימייל','email'],['phone','טלפון','tel']].map(([id, label, type]) => (
                <div key={id}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 6 }}>{label}</label>
                  <input type={type} required value={(form as any)[id]} onChange={e => setForm(f => ({ ...f, [id]: e.target.value }))}
                    style={{ width: '100%', border: '1.5px solid var(--gray-200)', borderRadius: 10, padding: '11px 14px', fontSize: 15, fontFamily: 'var(--font)', outline: 'none', direction: 'rtl' }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 6 }}>הודעה</label>
                <textarea required rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  style={{ width: '100%', border: '1.5px solid var(--gray-200)', borderRadius: 10, padding: '11px 14px', fontSize: 15, fontFamily: 'var(--font)', outline: 'none', direction: 'rtl', resize: 'vertical' }} />
              </div>
              <button type="submit" className="btn-secondary" style={{ fontSize: 15, padding: '13px 0', justifyContent: 'center' }}>שלח הודעה</button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
