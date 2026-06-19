import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="text-4xl font-black tracking-tight text-[var(--color-ink)] md:text-5xl">{title}</h1>
        <p className="mt-6 text-lg text-[var(--color-muted)]">הדף בבנייה — התוכן יתעדכן בקרוב.</p>
        <a href="/" className="mt-9 rounded-full bg-[var(--color-ink)] px-9 py-4 text-base font-semibold text-[var(--color-paper)] transition hover:bg-[var(--color-brown)]">
          חזרה לדף הבית
        </a>
      </main>
      <Footer />
    </>
  );
}
