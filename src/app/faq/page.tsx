'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  { q: 'מהם ימי ושעות הפתיחה?', a: 'אנו פתוחים ראשון עד חמישי 07:00–19:00 ושישי 07:00–14:00. שבת סגור.' },
  { q: 'האם יש משלוח עד הבית?', a: 'כן! משלוח חינם להזמנות מעל ₪400. להזמנות קטנות יותר עלות המשלוח היא ₪39.' },
  { q: 'מה מדיניות ההחזרות?', a: 'ניתן להחזיר מוצרים תוך 30 יום מיום הרכישה בתנאי שהמוצר באריזתו המקורית ולא נעשה בו שימוש.' },
  { q: 'האם אתם מציעים ייעוץ מקצועי?', a: 'בהחלט! הצוות המקצועי שלנו זמין לייעוץ בחנות, בטלפון ובצ׳אט באתר.' },
  { q: 'האם ניתן לקבל חשבונית עסקית?', a: 'כן, אנו מנפקים חשבוניות מס לעסקים. יש לציין זאת בעת ביצוע ההזמנה.' },
  { q: 'מה שיטות התשלום הקיימות?', a: 'אשראי, ביט, העברה בנקאית ומזומן בחנות. באתר — אשראי וביט.' },
  { q: 'האם יש אחריות על המוצרים?', a: 'כל המוצרים באתר כוללים אחריות יצרן. משך האחריות משתנה בין מוצר למוצר ומצוין בדף המוצר.' },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main style={{ direction: 'rtl', padding: '64px 0' }}>
      <div className="container" style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: 'var(--brown-dark)', marginBottom: 8, textAlign: 'center' }}>שאלות נפוצות</h1>
        <p style={{ textAlign: 'center', color: 'var(--gray-600)', marginBottom: 48 }}>כל מה שרצית לדעת</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ border: '1px solid var(--gray-200)', borderRadius: 14, overflow: 'hidden' }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', background: open === i ? 'var(--cream)' : '#fff', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)', textAlign: 'right' }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--brown-dark)' }}>{faq.q}</span>
                <ChevronDown size={18} color="var(--gray-400)" style={{ transition: 'transform 0.2s', transform: open === i ? 'rotate(180deg)' : 'rotate(0)' }} />
              </button>
              {open === i && (
                <div style={{ padding: '0 20px 20px', fontSize: 15, color: 'var(--gray-600)', lineHeight: 1.8 }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
