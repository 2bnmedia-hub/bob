export default function AboutPage() {
  return (
    <main style={{ direction: 'rtl', padding: '64px 0' }}>
      <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: 'var(--brown-dark)', marginBottom: 24 }}>אודות בוב חומרי בניין</h1>
        <div style={{ fontSize: 16, color: 'var(--gray-600)', lineHeight: 2, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <p>בוב חומרי בניין הוא עסק משפחתי הפועל בקריית ים מזה למעלה מ-20 שנה. אנו מתמחים במכירת חומרי בניין, כלי עבודה, ציוד חשמלי ואינסטלציה לקהל הרחב ולקבלנים.</p>
          <p>אנו מאמינים בשירות אישי, מקצועי וזמין — כל לקוח מקבל ייעוץ מותאם אישית מצוות המומחים שלנו.</p>
          <p>החנות שלנו ממוקמת בקריית ים ופתוחה ראשון עד חמישי 07:00–19:00 ושישי 07:00–14:00.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginTop: 16 }}>
            {[['20+', 'שנות ניסיון'],['5,000+', 'מוצרים במלאי'],['10,000+', 'לקוחות מרוצים']].map(([n, l]) => (
              <div key={l} style={{ background: 'var(--cream)', borderRadius: 16, padding: 32, textAlign: 'center' }}>
                <div style={{ fontSize: 40, fontWeight: 900, color: 'var(--brown)' }}>{n}</div>
                <div style={{ fontSize: 15, color: 'var(--gray-600)', marginTop: 8 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
