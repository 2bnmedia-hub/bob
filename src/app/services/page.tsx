'use client';
import { Key, Radio, HardHat, Scissors, Truck, Wrench } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    { title: 'שכפול מפתחות', desc: 'שכפול מפתחות לכל סוגי המנעולים במקום תוך דקות', icon: Key },
    { title: 'קידוד שלטים', desc: 'קידוד שלטי רכב, שערים וגרז׳ים מכל הסוגים', icon: Radio },
    { title: 'ייעוץ מקצועי', desc: 'ייעוץ חינם לכל פרויקט בנייה ושיפוץ', icon: HardHat },
    { title: 'חיתוך חומרים', desc: 'חיתוך צינורות, פרופילים וחומרי בניין במקום', icon: Scissors },
    { title: 'משלוח עד הבית', desc: 'משלוח מהיר לכל הארץ, חינם מעל ₪400', icon: Truck },
    { title: 'התקנה', desc: 'שירות התקנה לציוד חשמל ואינסטלציה', icon: Wrench },
  ];

  return (
    <main style={{ direction: 'rtl', padding: '64px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: 36, fontWeight: 900, color: '#111', marginBottom: 12, textAlign: 'center' }}>השירותים שלנו</h1>
        <p style={{ textAlign: 'center', color: 'var(--gray-600)', marginBottom: 48, fontSize: 16 }}>מעבר למכירת מוצרים — אנחנו כאן לעזור</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {services.map(s => (
            <div key={s.title} style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 16, padding: 32, textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <div style={{ background: 'linear-gradient(135deg, #FFF8E1, #FFF3CD)', borderRadius: 16, padding: 18, display: 'inline-flex' }}>
                  <s.icon size={32} strokeWidth={1.6} color="var(--gold)" />
                </div>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 10 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
