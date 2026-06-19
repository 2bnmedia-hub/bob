const TRUST_ITEMS = [
  { title: "שירות אישי", icon: "M3 13h12V6H3v7zm12 0h2.5l2.5 3v4h-5v-7zM7 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm10 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" },
  { title: "משלוח מהיר", icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v9a1 1 0 001 1h1m8 0a2 2 0 11-4 0m4 0a2 2 0 104 0m-4 0H9m10 0h1a1 1 0 001-1v-3.5a1 1 0 00-.3-.7l-2.5-2.5a1 1 0 00-.7-.3H13" },
  { title: "תשלום מאובטח", icon: "M4 10h16v9H4v-9z M8 10V7a4 4 0 118 0v3" },
  { title: "אחריות מלאה", icon: "M12 3l7 3v6c0 5-3 8-7 9-4-1-7-4-7-9V6l7-3z" },
  { title: "החזרות קלות", icon: "M9 15L4 10l5-5 M4 10h11a4 4 0 014 4v1" },
];

export default function TrustSection() {
  return (
    <section className="border-y border-[var(--color-line)] bg-[var(--color-surface)]">
      <div className="mx-auto grid max-w-[96vw] grid-cols-2 gap-5 px-5 py-7 md:grid-cols-5">
        {TRUST_ITEMS.map(function (item) {
          return (
            <div key={item.title} className="flex flex-col items-center text-center">
              <svg className="mb-2 h-7 w-7 text-[var(--color-brown)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
              <p className="text-[16px] font-medium text-[var(--color-ink)]">{item.title}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
