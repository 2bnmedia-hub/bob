"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("הפנייה נשלחה! נחזור אליך בהקדם.");
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-20">
        <h1 className="text-4xl font-black tracking-tight text-[var(--color-ink)] md:text-5xl">צור קשר</h1>
        <p className="mt-6 text-lg leading-relaxed text-[var(--color-muted)]">
          לייעוץ וקבלת הצעת מחיר אטרקטיבית, השאירו פרטים או התקשרו: <span className="font-bold text-[var(--color-ink)]">055-999-8088</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div>
            <label className="mb-2 block text-base font-medium text-[var(--color-ink)]">שם מלא</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} type="text" className="w-full rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3.5 text-base outline-none transition focus:border-[var(--color-brown)]" />
          </div>
          <div>
            <label className="mb-2 block text-base font-medium text-[var(--color-ink)]">טלפון / נייד</label>
            <input required value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" className="w-full rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3.5 text-base outline-none transition focus:border-[var(--color-brown)]" />
          </div>
          <div>
            <label className="mb-2 block text-base font-medium text-[var(--color-ink)]">אימייל</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3.5 text-base outline-none transition focus:border-[var(--color-brown)]" />
          </div>
          <div>
            <label className="mb-2 block text-base font-medium text-[var(--color-ink)]">תיאור הבקשה</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="w-full rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3.5 text-base outline-none transition focus:border-[var(--color-brown)]" />
          </div>
          <button type="submit" className="rounded-full bg-[var(--color-ink)] px-9 py-4 text-base font-semibold text-[var(--color-paper)] transition hover:bg-[var(--color-brown)]">
            שלח
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}
