"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("נרשמת בהצלחה לדיוור!");
  }

  return (
    <section className="bg-[var(--color-ink)] py-9">
      <div className="mx-auto max-w-2xl px-5 text-center">
        <h2 className="text-2xl font-black text-white">הצטרפו לדיוור שלנו</h2>
        <p className="mt-1.5 text-[17px] text-white/70">מבצעים ועדכונים ישר למייל</p>
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="כתובת אימייל" className="flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-[17px] text-white placeholder:text-white/50 outline-none focus:border-[var(--color-brand)]" />
          <button type="submit" className="rounded-full bg-[var(--color-brand)] px-5 py-2.5 text-[17px] font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-brand-dark)]">הרשמה</button>
        </form>
      </div>
    </section>
  );
}
