const DEPARTMENTS = ["כלי עבודה", "חומרי בניין", "חשמל ביתי", "אחסון וארגון", "גינה", "בלוני גז וקמפינג"];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-line)] bg-[var(--color-surface)]">
      <div className="mx-auto grid max-w-[96vw] grid-cols-2 gap-7 px-5 py-9 md:grid-cols-4">
        <div>
          <img src="/logo.png" alt="בוב חומרי בניין" className="h-9 w-auto" />
          <p className="mt-3 text-[16px] leading-relaxed text-[var(--color-muted)]">חומרי בניין, כלי עבודה ומצרכי בית — מקצועיות בכל פרויקט.</p>
          <p className="mt-2.5 text-[16px] font-medium text-[var(--color-ink)]">055-999-8088</p>
          <p className="mt-1 text-[14px] text-[var(--color-muted)]">ראשון–חמישי 7:00–19:00 | שישי 7:00–14:00</p>
        </div>

        <div>
          <h4 className="text-[17px] font-bold text-[var(--color-ink)]">מחלקות</h4>
          <ul className="mt-3 space-y-1.5">
            {DEPARTMENTS.map(function (d) {
              return (<li key={d}><a href={"/category/" + encodeURIComponent(d)} className="text-[16px] text-[var(--color-muted)] hover:text-[var(--color-brown)]">{d}</a></li>);
            })}
          </ul>
        </div>

        <div>
          <h4 className="text-[17px] font-bold text-[var(--color-ink)]">שירות לקוחות</h4>
          <ul className="mt-3 space-y-1.5">
            <li><a href="/about" className="text-[16px] text-[var(--color-muted)] hover:text-[var(--color-brown)]">אודותינו</a></li>
            <li><a href="/contact" className="text-[16px] text-[var(--color-muted)] hover:text-[var(--color-brown)]">צור קשר</a></li>
            <li><a href="/faq" className="text-[16px] text-[var(--color-muted)] hover:text-[var(--color-brown)]">שאלות נפוצות</a></li>
            <li><a href="/cart" className="text-[16px] text-[var(--color-muted)] hover:text-[var(--color-brown)]">סל קניות</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[17px] font-bold text-[var(--color-ink)]">משפטי</h4>
          <ul className="mt-3 space-y-1.5">
            <li><a href="/terms" className="text-[16px] text-[var(--color-muted)] hover:text-[var(--color-brown)]">תקנון האתר</a></li>
            <li><a href="/privacy" className="text-[16px] text-[var(--color-muted)] hover:text-[var(--color-brown)]">מדיניות פרטיות</a></li>
            <li><a href="/accessibility" className="text-[16px] text-[var(--color-muted)] hover:text-[var(--color-brown)]">הצהרת נגישות</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--color-line)] px-5 py-4">
        <p className="mx-auto max-w-[96vw] text-[14px] text-[var(--color-muted)]">© 2026 בוב חומרי בניין. כל הזכויות שמורות.</p>
      </div>
    </footer>
  );
}
