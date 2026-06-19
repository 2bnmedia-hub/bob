"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center px-5 py-20 text-center">
          <svg className="mb-6 h-16 w-16 text-[var(--color-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.9-4.594 2.252-6.75H5.106M7.5 14.25L5.106 5.272M6 19.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm14.25 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          <h1 className="text-3xl font-black tracking-tight text-[var(--color-ink)]">הסל שלך ריק</h1>
          <p className="mt-4 text-lg text-[var(--color-muted)]">עדיין לא הוספת מוצרים לסל הקניות.</p>
          <a href="/" className="mt-9 rounded-full bg-[var(--color-ink)] px-9 py-4 text-base font-semibold text-[var(--color-paper)] transition hover:bg-[var(--color-brown)]">המשך בקנייה</a>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[96vw] px-5 py-12">
        <h1 className="mb-8 text-3xl font-black text-[var(--color-ink)]">סל הקניות שלי</h1>
        <div className="grid gap-8 md:grid-cols-[1fr_320px]">
          <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-paper)]">
            {items.map(function (item) {
              return (
                <div key={item.id} className="flex items-center gap-4 border-b border-[var(--color-line)] p-4 last:border-b-0">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-[var(--color-surface)]">
                    {item.image_url ? <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" /> : null}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[var(--color-ink)]">{item.name}</p>
                    <p className="mt-1 text-[var(--color-muted)]">₪{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-8 w-8 rounded-full border border-[var(--color-line)]">−</button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-8 w-8 rounded-full border border-[var(--color-line)]">+</button>
                  </div>
                  <p className="w-20 text-end font-bold text-[var(--color-ink)]">₪{item.price * item.quantity}</p>
                  <button onClick={() => removeItem(item.id)} className="text-red-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="h-fit rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
            <div className="flex justify-between text-[var(--color-muted)]">
              <span>סכום ביניים</span>
              <span>₪{total}</span>
            </div>
            <div className="mt-2 flex justify-between text-xl font-black text-[var(--color-ink)]">
              <span>סה"כ לתשלום</span>
              <span>₪{total}</span>
            </div>
            <button className="mt-6 w-full rounded-full bg-[var(--color-ink)] py-3.5 font-semibold text-white transition hover:bg-[var(--color-brown)]">
              המשך לתשלום
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
