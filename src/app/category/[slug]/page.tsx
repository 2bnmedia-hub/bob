import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const name = decodeURIComponent(slug);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm text-[var(--color-muted)]">
          <a href="/" className="hover:text-[var(--color-brown)]">דף הבית</a> / {name}
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--color-ink)] md:text-5xl">{name}</h1>
        <div className="mt-16 flex min-h-[30vh] flex-col items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] text-center">
          <p className="text-lg text-[var(--color-muted)]">המוצרים בקטגוריה זו יתעדכנו בקרוב.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
