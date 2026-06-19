"use client";

import { useCart } from "@/context/CartContext";

const PRODUCTS = [
  { id: "p1", name: "מקדחה אלחוטית 18V מקצועית עם מארז", brand: "DeWalt", price: 349, old: 429, discount: 18, badge: "ירידת מחיר באתר", img: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&q=80", expires: "28.6.26" },
  { id: "p2", name: "סט מברגים מקצועי 32 חלקים עם מזוודה", brand: "Bosch", price: 129, old: 195, discount: 34, badge: "ירידת מחיר רק באתר", img: "https://images.unsplash.com/photo-1426927308491-6380b6a9936f?w=500&q=80", expires: "28.6.26" },
  { id: "p3", name: "בלון גז קמפינג 220 גרם תואם לכל מבער", brand: "Campingaz", price: 29, old: 47, discount: 38, badge: "ירידת מחיר באתר", img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&q=80", expires: "22.6.26" },
  { id: "p4", name: "חבל פוליפרופילן 20 מטר עמיד וחזק", brand: "ProRope", price: 39, old: 79, discount: 51, badge: "הנחה 51%", img: "https://images.unsplash.com/photo-1597762470488-3b9481c4dd92?w=500&q=80", expires: "5.7.26" },
  { id: "p5", name: "מסור דיסק נטען 18V עם להב יהלום", brand: "Makita", price: 389, old: 459, discount: 15, badge: "ירידת מחיר באתר", img: "https://images.unsplash.com/photo-1426927308491-6380b6a9936f?w=500&q=80", expires: "30.6.26" },
  { id: "p6", name: "צבע אקרילי לבן 4 ליטר עמיד לשטיפה", brand: "Tambour", price: 89, old: 119, discount: 25, badge: "ירידת מחיר רק באתר", img: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500&q=80", expires: "28.6.26" },
];

export default function FeaturedProducts() {
  const { addItem } = useCart();

  return (
    <section className="mx-auto max-w-[96vw] px-5 py-9">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-3xl font-black tracking-tight text-[var(--color-ink)]">המבצעים החמים שלנו</h2>
        <a href="/category/מבצעים" className="text-[15px] font-semibold text-[var(--color-brown)] hover:underline">לכל המבצעים ←</a>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {PRODUCTS.map(function (p) {
          return (
            <div key={p.id} className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative aspect-square w-full overflow-hidden bg-[var(--color-surface)]">
                <span className="absolute start-2 top-2 z-10 rounded-full bg-[var(--color-brown)] px-2.5 py-1 text-[11px] font-bold text-white shadow">{p.badge}</span>
                <img src={p.img} alt={p.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col px-3 pt-3">
                <span className="mb-1.5 inline-block w-fit rounded-full bg-[var(--color-surface)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--color-muted)]">{p.brand}</span>
                <h3 className="line-clamp-2 min-h-[42px] text-[14px] font-medium text-[var(--color-ink)]">{p.name}</h3>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-[13px] text-[var(--color-muted)] line-through">₪{p.old}</span>
                </div>
                <p className="text-[22px] font-black text-[var(--color-ink)]">₪{p.price}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="rounded-full bg-[var(--color-brand)]/15 px-2.5 py-0.5 text-[12px] font-bold text-[var(--color-brand-dark)]">{p.discount}% חסכון</span>
                </div>
                <p className="mt-1.5 text-[11px] text-[var(--color-muted)]">בתוקף עד {p.expires}</p>
              </div>
              <div className="mx-3 mb-3 mt-2 flex gap-2">
                <a href="/product/example" className="flex-1 rounded-full bg-[var(--color-brown)] py-2.5 text-center text-[14px] font-bold text-white transition hover:bg-[var(--color-brand-dark)]">
                  לרכישה
                </a>
                <button onClick={() => addItem({ id: p.id, name: p.name, price: p.price, image_url: p.img })} aria-label="הוסף לסל" className="flex items-center justify-center rounded-full border border-[var(--color-line)] px-3 transition hover:border-[var(--color-brown)] hover:bg-[var(--color-surface)]">
                  <svg className="h-5 w-5 text-[var(--color-ink)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.9-4.594 2.252-6.75H5.106M7.5 14.25L5.106 5.272M6 19.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm14.25 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
