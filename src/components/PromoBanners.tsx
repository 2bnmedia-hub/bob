export default function PromoBanners() {
  return (
    <section className="mx-auto max-w-[96vw] px-5 py-3">
      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
        <a href="/category/מבצעים" className="group relative aspect-[3/1] overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-brown)]">
          <img src="https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=900&q=80" alt="מבצעים" className="h-full w-full object-cover opacity-60 transition duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-black text-white">מבצעים שווים על כלי עבודה</span>
          </div>
        </a>
        <a href="/category/חדש על המדף" className="group relative aspect-[3/1] overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-brand-dark)]">
          <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=900&q=80" alt="חדש על המדף" className="h-full w-full object-cover opacity-60 transition duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-black text-white">הגיע חדש על המדף</span>
          </div>
        </a>
      </div>
    </section>
  );
}
