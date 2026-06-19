export default function TermsPage() {
  return (
    <main style={{ direction: 'rtl', padding: '64px 0' }}>
      <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: '#111', marginBottom: 32 }}>תנאי שימוש</h1>
        <div style={{ fontSize: 15, color: 'var(--gray-600)', lineHeight: 2, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {[
            ['כללי', 'השימוש באתר בוב חומרי בניין מהווה הסכמה לתנאי השימוש המפורטים להלן. האתר שומר לעצמו את הזכות לשנות את התנאים בכל עת.'],
            ['הזמנות ותשלום', 'כל ההזמנות כפופות לאישור ולזמינות המלאי. התשלום מתבצע בצורה מאובטחת ומוצפנת.'],
            ['משלוח', 'זמן האספקה הממוצע הוא 3-5 ימי עסקים. משלוח חינם להזמנות מעל ₪400.'],
            ['החזרות', 'ניתן להחזיר מוצרים תוך 30 יום מיום הרכישה בתנאי שהמוצר באריזתו המקורית.'],
            ['פרטיות', 'אנו מכבדים את פרטיותך ולא נעביר את פרטיך לצד שלישי ללא הסכמתך.'],
          ].map(([title, text]) => (
            <div key={title as string}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#222', marginBottom: 8 }}>{title}</h2>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
