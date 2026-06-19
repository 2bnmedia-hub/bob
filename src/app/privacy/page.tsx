export default function PrivacyPage() {
  return (
    <main style={{ direction: 'rtl', padding: '64px 0' }}>
      <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: 'var(--brown-dark)', marginBottom: 32 }}>מדיניות פרטיות</h1>
        <div style={{ fontSize: 15, color: 'var(--gray-600)', lineHeight: 2, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {[
            ['מידע שאנו אוספים', 'אנו אוספים מידע שנמסר לנו ישירות בעת הרשמה, רכישה או יצירת קשר: שם, כתובת אימייל, טלפון וכתובת למשלוח.'],
            ['שימוש במידע', 'המידע משמש לעיבוד הזמנות, שיפור השירות ושליחת עדכונים רלוונטיים. לא נמכור את פרטיך לצד שלישי.'],
            ['עוגיות', 'האתר משתמש בעוגיות לשיפור חווית הגלישה ולניתוח תנועה. ניתן לבטל עוגיות בהגדרות הדפדפן.'],
            ['אבטחה', 'אנו נוקטים באמצעי אבטחה מתקדמים להגנה על המידע שלך. כל התשלומים מוצפנים ומאובטחים.'],
            ['יצירת קשר', 'לשאלות בנושא פרטיות ניתן לפנות אלינו בכתובת info@bob-hardware.co.il'],
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
