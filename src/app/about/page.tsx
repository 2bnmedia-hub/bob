import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-4xl font-black tracking-tight text-[var(--color-ink)] md:text-5xl">אודותינו</h1>
        <p className="mt-8 text-xl leading-relaxed text-[var(--color-ink)]">
          כל מה שצריך לבנייה ושיפוץ — במקום אחד.
        </p>
        <p className="mt-6 text-lg leading-relaxed text-[var(--color-muted)]">
          ברוכים הבאים לחנות חומרי הבניין שלנו. אצלנו תמצאו את כל הפתרונות לבנייה, שיפוץ ותחזוקה: חומרי בניין, כלי עבודה, חשמל, ציוד גינון ועוד. אנחנו כאן בשבילכם עם שירות אישי, מלאי מגוון ומחירים מעולים.
        </p>
        <p className="mt-6 text-lg leading-relaxed text-[var(--color-muted)]">
          אנחנו מאמינים שלבנות זה לא רק חומרים וכלים — זה ליצור בית, עסק, חלום. במשך שנים אנחנו מספקים ללקוחותינו חומרי בניין וכלי עבודה באיכות גבוהה, עם יחס אישי וליווי מקצועי. בין אם אתם קבלנים, שיפוצניקים או משפחות שרוצות לשדרג את הבית — אצלנו תמצאו כל מה שאתם צריכים, במקום אחד, ובשירות מהלב.
        </p>
        <p className="mt-6 text-lg leading-relaxed text-[var(--color-muted)]">
          החזון שלנו הוא לספק שילוב מנצח של אמינות, איכות ושירות אישי. יחד איתנו, תדעו שתמיד יש מי שדואג לכם — החל מבחירת החומרים ועד ההעמסה לרכב. אצלנו זה לא רק חנות, אלא בית שלם לבנייה ושיפוץ.
        </p>
        <a href="/contact" className="mt-10 inline-block rounded-full bg-[var(--color-ink)] px-9 py-4 text-base font-semibold text-[var(--color-paper)] transition hover:bg-[var(--color-brown)]">
          דברו איתנו
        </a>
      </main>
      <Footer />
    </>
  );
}
