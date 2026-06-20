'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#F5F5F5', color: '#222', padding: '56px 0 0', direction: 'rtl' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr) 220px', gap: 32, marginBottom: 40 }}>
          {[
            { title: 'דרכי קנייה', items: ['מיקום הסניף על המפה','כרטיסי מתנה'] },
            { title: 'שירות לקוחות', items: ['צור קשר','התכתבות בוואטסאפ','מדיניות החזרות','משלוח ואיסוף'] },
            { title: 'על חנות בוב הבנאי', items: ['אודות','קריירה','תנאי שימוש','ספקים'] },
            { title: 'משאבים ומידע', items: ['טיפים ועצות','שירותי חנות','הצהרת נגישות','תקנון אתר'] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ color: '#222', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>{col.title}</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.items.map(it => (
                  <li key={it}>
                    <Link href={it === 'מיקום הסניף על המפה' ? 'https://maps.google.com/?q=גאולה+כהן+2+קריית+ים' : '#'} target={it === 'מיקום הסניף על המפה' ? '_blank' : undefined} rel={it === 'מיקום הסניף על המפה' ? 'noopener noreferrer' : undefined} style={{ fontSize: 14, color: '#555', transition: 'color 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold-light)')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#555')}
                    >{it}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div style={{ background: 'var(--gold)', borderRadius: 16, padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#111', marginBottom: 4 }}>BOB</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#333', letterSpacing: 3, marginBottom: 20 }}>REWARDS</div>
            <Link href="#" style={{ display: 'block', color: '#333', fontSize: 13, marginBottom: 8 }}>למד עוד</Link>
            <Link href="#" style={{ display: 'block', color: '#111', fontSize: 13, fontWeight: 700 }}>הצטרף עכשיו →</Link>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #DDD', padding: '28px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: 15, color: '#222', fontWeight: 600, marginBottom: 12 }}>קבל הצעות בלעדיות וטיפים מקצועיים</div>
            <div style={{ display: 'flex' }}>
              <input type="email" placeholder="הכנס כתובת אימייל" style={{ border: 'none', padding: '11px 18px', fontSize: 14, width: 260, borderRadius: '0 8px 8px 0', fontFamily: 'var(--font)', direction: 'rtl', outline: 'none' }} />
              <button style={{ background: 'var(--gold)', color: '#111', border: 'none', padding: '11px 22px', fontWeight: 700, fontSize: 14, borderRadius: '8px 0 0 8px', cursor: 'pointer', fontFamily: 'var(--font)' }}>הצטרף</button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Facebook','Instagram','TikTok','YouTube'].map(s => (
              <Link key={s} href="#" style={{ fontSize: 13, color: '#555', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold-light)')}
                onMouseLeave={e => (e.currentTarget.style.color = '#555')}
              >{s}</Link>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid #DDD', padding: '16px 0', textAlign: 'center', fontSize: 12, color: '#888' }}>
          © 2025 בוב חומרי בניין קריית ים. כל הזכויות שמורות. | עיצוב ובנייה: <a href="https://2bnmedia.com" target="_blank" rel="noopener noreferrer" style={{color:"#2D6A4F",fontWeight:700,textDecoration:"underline"}}>2bnmedia.com</a>
        </div>
      </div>
    </footer>
  );
}
