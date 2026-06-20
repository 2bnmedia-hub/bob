'use client'

const CARDS = [
  { icon: '🔥', title: 'מבצעי השבוע', desc: 'עריכת מוצרים ומחירים מיוחדים לשבוע הנוכחי', color: '#FFF3E0' },
  { icon: '🖼️', title: 'גלריית תמונות', desc: 'ניהול תמונות המוצגות בגלריה הראשית', color: '#E8F5E9' },
  { icon: '🎯', title: 'סקשן ראשי', desc: 'עריכת הכותרת, תת-כותרת והכפתורים בבאנר העליון', color: '#E3F2FD' },
  { icon: '⚡', title: 'העסקאות הכי שוות', desc: 'בחירת מוצרים להצגה בסקשן העסקאות המובחרות', color: '#FCE4EC' },
  { icon: '💎', title: 'העסקאות הטובות ביותר', desc: 'ניהול רשימת ההצעות הטובות ביותר בדף הבית', color: '#EDE7F6' },
  { icon: '🗂️', title: 'קטגוריות מובילות', desc: 'סידור וניהול הקטגוריות המוצגות בדף הבית', color: '#E0F7FA' },
]

export default function HomepageSection() {
  return (
    <div style={{ padding: 24, direction: 'rtl' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#222', marginBottom: 8 }}>ניהול דף הבית</h2>
      <p style={{ fontSize: 14, color: '#888', marginBottom: 28 }}>בחר סקשן לעריכה</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {CARDS.map(card => (
          <div key={card.title} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 14, padding: 20, cursor: 'pointer', transition: 'box-shadow 0.2s', display: 'flex', gap: 16, alignItems: 'flex-start' }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#222', marginBottom: 6 }}>{card.title}</div>
              <div style={{ fontSize: 13, color: '#888', lineHeight: 1.5 }}>{card.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
