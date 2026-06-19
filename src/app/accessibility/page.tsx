export default function AccessibilityPage() {
  return (
    <main style={{ direction: 'rtl', padding: '64px 0' }}>
      <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: 'var(--brown-dark)', marginBottom: 32 }}>הצהרת נגישות</h1>
        <div style={{ fontSize: 15, color: 'var(--gray-600)', lineHeight: 2, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <p>בוב חומרי בניין מחויב להנגיש את האתר לכלל הציבור, לרבות אנשים עם מוגבלויות, בהתאם לתקן הישראלי IS 5568 ולהנחיות WCAG 2.1 ברמה AA.</p>
          {[
            ['מה בוצע', 'האתר תומך בניווט מקלדת, קורא מסך, הגדלת טקסט וניגודיות גבוהה. כל התמונות כוללות תיאור חלופי.'],
            ['פניות נגישות', 'נתקלת בבעיית נגישות? נשמח לשמוע ולטפל בהקדם. פנה אלינו בטלפון 055-999-8088 או במייל info@bob-hardware.co.il'],
            ['עדכון אחרון', 'הצהרה זו עודכנה בינואר 2025.'],
          ].map(([title, text]) => (
            <div key={title as string}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--brown)', marginBottom: 8 }}>{title}</h2>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
