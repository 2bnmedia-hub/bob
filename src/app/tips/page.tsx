export default function TipsPage() {
  const tips = [
    { title: 'כיצד לבחור צבע לקירות', cat: 'צביעה', img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80', desc: 'מדריך מקיף לבחירת הגוון הנכון לכל חדר.' },
    { title: 'תיקון דלף בברז', cat: 'אינסטלציה', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', desc: 'שלבים פשוטים לתיקון ברז מטפטף בבית.' },
    { title: 'הנחת ריצוף בעצמך', cat: 'ריצוף', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80', desc: 'כל מה שצריך לדעת לפני שמתחילים לרצף.' },
    { title: 'איטום גג — מדריך מלא', cat: 'איטום', img: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&q=80', desc: 'כיצד לאטום גג בצורה נכונה ועמידה.' },
    { title: 'התקנת מאוורר תקרה', cat: 'חשמל', img: 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=400&q=80', desc: 'מדריך להתקנה בטוחה של מאוורר תקרה.' },
    { title: 'גינון קיץ — 5 טיפים', cat: 'גינון', img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80', desc: 'שמור על גינתך ירוקה לאורך כל הקיץ.' },
  ];

  return (
    <main style={{ direction: 'rtl', padding: '64px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: 36, fontWeight: 900, color: '#111', marginBottom: 12, textAlign: 'center' }}>פרויקטים וטיפים</h1>
        <p style={{ textAlign: 'center', color: 'var(--gray-600)', marginBottom: 48, fontSize: 16 }}>מדריכים מקצועיים מהשטח</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {tips.map(t => (
            <div key={t.title} style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 16, overflow: 'hidden', transition: 'box-shadow 0.2s', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              <div style={{ height: 180, overflow: 'hidden' }}>
                <img src={t.img} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: 20 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold-dark)', background: 'var(--cream)', padding: '3px 10px', borderRadius: 20, marginBottom: 10, display: 'inline-block' }}>{t.cat}</span>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#111', marginBottom: 8 }}>{t.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.6, marginBottom: 14 }}>{t.desc}</p>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#2D6A4F' }}>קרא עוד ←</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
