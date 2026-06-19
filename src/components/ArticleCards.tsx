const ARTICLES = [
  { title: "איך לבחור מקדחה לפרויקט הבא שלך?", desc: "מדריך קצר לבחירת המקדחה המתאימה לכל סוג עבודה.", img: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80" },
  { title: "כל מה שצריך לדעת על צביעת קירות", desc: "טיפים מהשטח להכנה נכונה ולתוצאה מקצועית בבית.", img: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&q=80" },
  { title: "10 כלים שכל בית צריך", desc: "רשימת הכלים הבסיסיים שיחסכו לכם כאב ראש בתיקונים.", img: "https://images.unsplash.com/photo-1426927308491-6380b6a9936f?w=400&q=80" },
];

export default function ArticleCards() {
  return (
    <section className="mx-auto max-w-[96vw] px-5 py-9">
      <h2 className="mb-5 text-3xl font-black tracking-tight text-[var(--color-ink)]">מהבלוג שלנו</h2>
      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
        {ARTICLES.map(function (a) {
          return (
            <a key={a.title} href="#" className="group overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)]">
              <div className="aspect-[16/9] w-full overflow-hidden bg-[var(--color-surface)]">
                <img src={a.img} alt={a.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
              </div>
              <div className="p-3.5">
                <h3 className="text-[17px] font-bold text-[var(--color-ink)]">{a.title}</h3>
                <p className="mt-1 text-[16px] text-[var(--color-muted)]">{a.desc}</p>
                <span className="mt-2 inline-block text-[16px] font-medium text-[var(--color-brown)]">קרא עוד ←</span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
