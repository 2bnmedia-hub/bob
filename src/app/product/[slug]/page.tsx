"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const name = decodeURIComponent(params.slug);
  const { addItem } = useCart();
  const price = 99;

  function handleAdd() {
    addItem({ id: name, name, price });
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-16">
        <p className="text-[var(--color-muted)]">
          <a href="/" className="hover:text-[var(--color-brown)]">דף הבית</a> / {name}
        </p>
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <div className="aspect-square w-full rounded-[var(--radius-md)] bg-[var(--color-surface)]" />
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[var(--color-ink)] md:text-4xl">{name}</h1>
            <p className="mt-3 text-2xl font-bold text-[var(--color-ink)]">₪{price}</p>
            <p className="mt-4 text-lg text-[var(--color-muted)]">פרטי המוצר המלאים יתעדכנו בקרוב.</p>
            <button onClick={handleAdd} className="mt-9 rounded-full bg-[var(--color-ink)] px-9 py-4 text-base font-semibold text-[var(--color-paper)] transition hover:bg-[var(--color-brown)]">
              הוספה לסל
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
