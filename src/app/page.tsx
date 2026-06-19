'use client';

import Link from 'next/link';
import { Truck, Lock, RotateCcw, Star, ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';

/* ─── ANIMATION HOOK ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    }}>{children}</div>
  );
}

/* ─── DATA ─── */
const HERO_SLIDES = [
  {
    title: 'חסכו עד ₪300',
    sub: 'על מוצרי בנייה נבחרים מהמותגים המובילים',
    btn: 'לקנייה עכשיו',
    badge: 'מבצע מיוחד',
    img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=900&q=80',
    overlay: 'rgba(50,30,15,0.45)',
  },
  {
    title: 'כלי עבודה מקצועיים',
    sub: 'מבחר ענק של כלים ממותגים מובילים',
    btn: 'גלו עכשיו',
    badge: 'חדש',
    img: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=900&q=80',
    overlay: 'rgba(20,20,20,0.5)',
  },
  {
    title: 'חומרי בניין איכותיים',
    sub: 'כל מה שצריך לפרויקט — במקום אחד',
    btn: 'לקטלוג',
    badge: 'קיץ 2025',
    img: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=900&q=80',
    overlay: 'rgba(30,50,15,0.5)',
  },
];

const PROMO_PRODUCTS = [
  { id: 'p1', name: 'ערכת כלים מקצועית 18 חלקים', price: 280, was: 350, rating: 4.5, reviews: 1234, img: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&q=80' },
  { id: 'p2', name: 'מקדחה נטענת 18V עם מטען', price: 160, was: 200, rating: 4.0, reviews: 567, img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80' },
  { id: 'p3', name: 'מסור עגול מקצועי 185mm', price: 380, was: 450, rating: 5.0, reviews: 89, img: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80' },
  { id: 'p4', name: 'גנרטור נייד 2000W', price: 420, was: 520, rating: 4.0, reviews: 321, img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80' },
];

const FEATURED_PRODUCTS = [
  { id: 'f1', name: 'מכונת גרס ענפים 2400W', price: 749, was: 850, rating: 4.5, reviews: 1200, img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80' },
  { id: 'f2', name: 'מרתך MIG מקצועי 160A', price: 499, was: 750, rating: 4.0, reviews: 500, img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80' },
  { id: 'f3', name: 'מזרקת גז 4 להבות', price: 300, was: 430, rating: 5.0, reviews: 200, img: 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=400&q=80' },
  { id: 'f4', name: 'סולם אלומיניום 3 מטר', price: 389, was: 580, rating: 4.0, reviews: 400, img: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&q=80' },
  { id: 'f5', name: 'מרסס חשמלי 650W', price: 259, was: 350, rating: 4.5, reviews: 800, img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80' },
  { id: 'f6', name: 'מוט בטון Ø10 6מ׳', price: 120, was: 140, rating: 4.0, reviews: 3400, img: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80' },
];

const CATEGORIES = [
  { name: 'מבצע', red: true, href: '/sales', img: '', icon: '🔥' },
  { name: 'בניין ושיפוץ', href: '/category/building', img: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=200&q=80' },
  { name: 'כלי עבודה', href: '/category/tools', img: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=200&q=80' },
  { name: 'חשמל', href: '/category/electric', img: 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=200&q=80' },
  { name: 'צבע וגימור', href: '/category/paint', img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&q=80' },
  { name: 'אינסטלציה', href: '/category/plumbing', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80' },
  { name: 'גינה וחוץ', href: '/category/garden', img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&q=80' },
  { name: 'דלתות וחלונות', href: '/category/doors', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80' },
  { name: 'ריצוף', href: '/category/flooring', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=200&q=80' },
];

const BRANDS = ['DeWalt','Milwaukee','Bosch','Makita','Stanley','Hilti','Festool','Stihl','Weber','Traeger','Benjamin Moore','Scotts','Valspar','3M'];

/* ─── STARS ─── */
function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ color: 'var(--gold)', fontSize: 13, display: 'flex', gap: 1 }}>
      {[1,2,3,4,5].map(i => <span key={i} style={{ opacity: i <= Math.round(rating) ? 1 : 0.2 }}>★</span>)}
    </div>
  );
}

/* ─── PRODUCT CARD ─── */
function ProductCard({ product, badge }: { product: typeof PROMO_PRODUCTS[0]; badge?: string }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  function handleAdd() {
    addItem({ id: product.id, name: product.name, price: product.price });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: '1px solid var(--gray-200)',
        borderRadius: 16,
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'box-shadow 0.25s, transform 0.25s',
        boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.05)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      {/* IMAGE */}
      <div style={{ position: 'relative', height: 180, overflow: 'hidden', background: 'var(--gray-100)' }}>
        <img src={product.img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', transform: hovered ? 'scale(1.06)' : 'scale(1)' }} />
        {badge && (
          <span style={{ position: 'absolute', top: 10, right: 10, background: 'var(--gray-800)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>{badge}</span>
        )}
      </div>

      {/* CONTENT */}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)', lineHeight: 1.4, minHeight: 40 }}>{product.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Stars rating={product.rating} />
          <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>({product.reviews.toLocaleString()})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 'auto' }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--gray-800)' }}>₪{product.price}</span>
          <span style={{ fontSize: 13, color: 'var(--gray-400)', textDecoration: 'line-through' }}>₪{product.was}</span>
          <span style={{ fontSize: 12, color: 'var(--red)', fontWeight: 700, marginRight: 'auto' }}>
            -{Math.round((1 - product.price / product.was) * 100)}%
          </span>
        </div>
        <button onClick={handleAdd} style={{
          width: '100%',
          background: added ? '#1b5e20' : 'transparent',
          color: added ? '#fff' : 'var(--red)',
          border: `1.5px solid ${added ? '#1b5e20' : 'var(--red)'}`,
          fontWeight: 700, fontSize: 14, padding: '10px 0',
          borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font)',
          transition: 'all 0.2s',
        }}>
          {added ? '✓ נוסף לסל' : 'הוסף לסל'}
        </button>
      </div>
    </div>
  );
}

/* ─── PAGE ─── */
export default function HomePage() {
  const [heroIdx, setHeroIdx] = useState(0);
  const [catTab, setCatTab] = useState(0);
  const [editTab, setEditTab] = useState(0);
  const hero = HERO_SLIDES[heroIdx];

  /* auto-advance hero */
  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const css = `
    @keyframes kenburns { from { transform: scale(1); } to { transform: scale(1.06); } }
    @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
    .hero-text { animation: fadeUp 0.7s ease both; }
  `;

  return (
    <main style={{ direction: 'rtl', background: '#fff' }}>
      <style>{css}</style>

      {/* ══ HERO ══ */}
      <section style={{ position: 'relative', height: 520, overflow: 'hidden' }}>
        {/* BG IMAGE */}
        <img
          key={heroIdx}
          src={hero.img}
          alt={hero.title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', animation: 'kenburns 6s ease forwards' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: hero.overlay }} />

        {/* TEXT */}
        <div className="container" style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
          <div className="hero-text" key={`text-${heroIdx}`} style={{ maxWidth: 520 }}>
            <span style={{ background: 'var(--gold)', color: 'var(--brown-dark)', fontSize: 12, fontWeight: 700, padding: '4px 14px', borderRadius: 20, display: 'inline-block', marginBottom: 16 }}>{hero.badge}</span>
            <h1 style={{ fontSize: 'clamp(36px,5vw,60px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 16, textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>{hero.title}</h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.88)', marginBottom: 28, lineHeight: 1.6 }}>{hero.sub}</p>
            <button className="btn-primary" style={{ fontSize: 16, padding: '13px 32px', borderRadius: 10 }}>{hero.btn}</button>
          </div>
        </div>

        {/* DOTS */}
        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 2 }}>
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setHeroIdx(i)} style={{ width: i === heroIdx ? 28 : 8, height: 8, borderRadius: 4, background: i === heroIdx ? 'var(--gold)' : 'rgba(255,255,255,0.5)', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} />
          ))}
        </div>

        {/* ARROWS */}
        {[0,1].map((_, i) => (
          <button key={i} onClick={() => setHeroIdx((heroIdx + (i === 0 ? -1 : 1) + HERO_SLIDES.length) % HERO_SLIDES.length)}
            style={{ position: 'absolute', top: '50%', [i === 0 ? 'right' : 'left']: 20, transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: 24, width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
          >{ i===0 ? <ChevronRight size={20}/> : <ChevronLeft size={20}/> }</button>
        ))}
      </section>

      {/* ══ TRUST BAR ══ */}
      <FadeIn>
        <section style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)', padding: '16px 0' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
            <>
              {([['משלוח חינם מ-₪400', 'truck'],['תשלום מאובטח','lock'],['החזרה תוך 30 יום','return'],['שירות מקצועי','star']] as [string,string][]).map(([text, type]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--gray-600)', fontWeight: 600 }}>
                  {type==='truck' && <Truck size={20} strokeWidth={1.8} color="var(--brown)" />}
                  {type==='lock' && <Lock size={20} strokeWidth={1.8} color="var(--brown)" />}
                  {type==='return' && <RotateCcw size={20} strokeWidth={1.8} color="var(--brown)" />}
                  {type==='star' && <Star size={20} strokeWidth={1.8} color="var(--brown)" />}
                  {text}
                </div>
              ))}
            </>
          </div>
        </section>
      </FadeIn>

      {/* ══ PROMO PRODUCTS ══ */}
      <section style={{ padding: '64px 0' }}>
        <div className="container">
          <FadeIn>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--gold-dark)', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>מבצעים מיוחדים</div>
                <h2 style={{ fontSize: 32, fontWeight: 900, color: 'var(--brown-dark)' }}>העסקאות הכי שוות</h2>
              </div>
              <Link href="/sales" style={{ fontSize: 14, fontWeight: 700, color: 'var(--brown)', textDecoration: 'underline' }}>כל המבצעים ←</Link>
            </div>
          </FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20, alignItems: 'start' }}>
            {/* BANNER */}
            <FadeIn>
              <div style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', height: '100%', minHeight: 400 }}>
                <img src="https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80" alt="מבצע" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(45,106,79,0.92) 40%, rgba(45,106,79,0.4) 100%)' }} />
                <div style={{ position: 'relative', zIndex: 1, padding: 28, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 6, fontWeight: 600 }}>מותג מוביל</div>
                  <h3 style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 10 }}>קולקציית<br/>הקיץ 2025</h3>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 20 }}>מוצרים נבחרים במחיר מיוחד</p>
                  <button style={{ background: '#fff', color: 'var(--red)', border: 'none', padding: '10px 20px', fontWeight: 700, fontSize: 13, borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font)', alignSelf: 'flex-start' }}>לקנייה עכשיו</button>
                </div>
              </div>
            </FadeIn>
            {/* PRODUCTS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
              {PROMO_PRODUCTS.map((p, i) => (
                <FadeIn key={p.id} delay={i * 80}>
                  <ProductCard product={p} badge="ONLINE DEAL" />
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FULL PROMO BANNER ══ */}
      <FadeIn>
        <section style={{ padding: '0 0 64px' }}>
          <div className="container">
            <div style={{ borderRadius: 20, overflow: 'hidden', position: 'relative', minHeight: 180 }}>
              <img src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1200&q=80" alt="מבצע" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(45,106,79,0.82)' }} />
              <div style={{ position: 'relative', zIndex: 1, padding: '40px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 6 }}>מבצע מיוחד</div>
                  <h2 style={{ fontSize: 28, fontWeight: 900, color: '#fff' }}>מצא את המתנה המושלמת לכל פרויקט</h2>
                </div>
                <button className="btn-primary" style={{ fontSize: 15, padding: '13px 32px', borderRadius: 10, flexShrink: 0 }}>לקנייה עכשיו</button>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ══ SHOP BY CATEGORY ══ */}
      <section style={{ padding: '80px 0', background: 'var(--gray-50)' }}>
        <div className="container">
          <FadeIn>
            <h2 className="section-title">קנייה לפי קטגוריה</h2>
          </FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9,1fr)', gap: 24 }}>
            {CATEGORIES.map((cat, i) => (
              <FadeIn key={cat.href} delay={i * 50}>
                <Link href={cat.href} style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}>
                  <div style={{
                    width: 80, height: 80, borderRadius: '50%', overflow: 'hidden',
                    background: cat.red ? 'var(--red)' : '#fff',
                    border: cat.red ? 'none' : '2px solid var(--gray-200)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 12px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
                  >
                    {cat.red
                      ? <span style={{ fontSize: 13, fontWeight: 900, color: '#fff', lineHeight: 1.4, display:'flex',flexDirection:'column',alignItems:'center',gap:2 }}>מבצע<ArrowLeft size={14} strokeWidth={2.5}/></span>
                      : <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    }
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--gray-700)', fontWeight: 600, lineHeight: 1.3 }}>{cat.name}</div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TOP DEALS ══ */}
      <section style={{ padding: '64px 0' }}>
        <div className="container">
          <FadeIn><h2 className="section-title">העסקאות הטובות ביותר</h2></FadeIn>
          <FadeIn delay={100}>
            <div style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', marginBottom: 20 }}>
              <img src="https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=1200&q=80" alt="עסקה" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(45,106,79,0.85)' }} />
              <div style={{ position: 'relative', zIndex: 1, padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>₪49 בלבד — ערכת כלים נבחרת</h3>
                <button className="btn-primary" style={{ flexShrink: 0 }}>לקנייה עכשיו</button>
              </div>
            </div>
          </FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16, alignItems: 'stretch' }}>
            {[
              { n: '₪300', sub: 'חסוך על ציוד בנייה נבחר', img: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&q=80', dark: true, height: 'auto' },
              { n: '₪4', sub: 'על חומרי איטום', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', dark: false },
              { n: '₪40', sub: 'על סולמות נבחרים', img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80', dark: false },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', minHeight: 220, height: '100%' }}>
                  <img src={item.img} alt={item.sub} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: item.dark ? 'rgba(50,30,15,0.75)' : 'rgba(255,255,255,0.82)' }} />
                  <div style={{ position: 'relative', zIndex: 1, padding: 24 }}>
                    <div style={{ fontSize: 13, color: item.dark ? 'var(--gold-light)' : 'var(--gray-600)', marginBottom: 4 }}>חסוך עד</div>
                    <div style={{ fontSize: item.dark ? 52 : 36, fontWeight: 900, color: item.dark ? 'var(--gold)' : 'var(--red)', lineHeight: 1 }}>{item.n}</div>
                    <div style={{ fontSize: 13, color: item.dark ? 'rgba(255,255,255,0.75)' : 'var(--gray-600)', marginTop: 8 }}>{item.sub}</div>
                    {item.dark && <button className="btn-primary" style={{ marginTop: 16, fontSize: 13 }}>לקנייה עכשיו</button>}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURED PRODUCTS ══ */}
      <section style={{ padding: '80px 0', background: 'var(--gray-50)' }}>
        <div className="container">
          <FadeIn>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
              <h2 style={{ fontSize: 32, fontWeight: 900, color: 'var(--brown-dark)' }}>קטגוריות מובילות</h2>
              <div style={{ display: 'flex', gap: 6 }}>
                {['הכל','מכסחות','גריל','כלי חשמל','גינון'].map((tab, i) => (
                  <button key={tab} onClick={() => setCatTab(i)} style={{ padding: '7px 18px', fontSize: 13, fontWeight: 600, border: '1.5px solid', borderColor: i === catTab ? 'var(--brown)' : 'var(--gray-200)', cursor: 'pointer', fontFamily: 'var(--font)', background: i === catTab ? 'var(--brown)' : '#fff', color: i === catTab ? 'var(--gold)' : 'var(--gray-600)', borderRadius: 8, transition: 'all 0.2s' }}>{tab}</button>
                ))}
              </div>
            </div>
          </FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 16 }}>
            {FEATURED_PRODUCTS.map((p, i) => (
              <FadeIn key={p.id} delay={i * 60}>
                <ProductCard product={p} badge="SALE" />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ EDITORIAL ══ */}
      <section style={{ padding: '64px 0' }}>
        <div className="container">
          <FadeIn><h2 className="section-title">מדריכים וטיפים מקצועיים</h2></FadeIn>
          <FadeIn delay={100}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 0, justifyContent: 'center' }}>
              {['שיפוץ','גינון','ארגון','צביעה'].map((t, i) => (
                <button key={t} onClick={() => setEditTab(i)} style={{ padding: '9px 22px', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'var(--font)', background: i === editTab ? 'var(--brown)' : 'var(--gray-100)', color: i === editTab ? 'var(--gold)' : 'var(--gray-600)', borderRadius: i === 0 ? '8px 0 0 0' : i === 3 ? '0 8px 0 0' : '0', transition: 'all 0.2s' }}>{t}</button>
              ))}
            </div>
            <div style={{ border: '1px solid var(--gray-200)', borderRadius: '0 8px 8px 8px', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr' }}>
                <div style={{ height: 200, overflow: 'hidden' }}>
                  <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80" alt="טיפ" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: 32, background: 'var(--gray-50)' }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--brown)', marginBottom: 12 }}>טיפ מקצועי — {['שיפוץ','גינון','ארגון','צביעה'][editTab]}</h3>
                  <p style={{ fontSize: 15, color: 'var(--gray-600)', marginBottom: 20, lineHeight: 1.7 }}>מדריך מקיף לעבודה מקצועית עם חומרים וכלים נכונים. כל מה שצריך לדעת לפני שמתחילים — מהכנת השטח ועד הגימור הסופי.</p>
                  <button className="btn-secondary" style={{ fontSize: 13, padding: '10px 24px' }}>קרא עוד</button>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ BRANDS ══ */}
      <section style={{ padding: '80px 0', background: 'var(--gray-50)' }}>
        <div className="container">
          <FadeIn><h2 className="section-title">המותגים המובילים תחת קורת גג אחת</h2></FadeIn>
          <FadeIn delay={100}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 12 }}>
              {BRANDS.map(b => (
                <div key={b} style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 12, padding: '22px 8px', textAlign: 'center', fontSize: 14, fontWeight: 700, color: 'var(--gray-700)', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; el.style.transform = 'translateY(-2px)'; el.style.borderColor = 'var(--gold)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = 'none'; el.style.transform = 'translateY(0)'; el.style.borderColor = 'var(--gray-200)'; }}
                >{b}</div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: 'var(--brown-dark)', color: '#ccc', padding: '56px 0 0', direction: 'rtl' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr) 220px', gap: 32, marginBottom: 40 }}>
            {[
              { title: 'דרכי קנייה', items: ['איתור סניף','מבצעים','מותגים','כרטיסי מתנה','אפליקציה'] },
              { title: 'שירות לקוחות', items: ['צור קשר','מעקב הזמנה','החזרות','משלוח ואיסוף','אבטחה'] },
              { title: 'על BOB', items: ['אודות','קריירה','תנאי שימוש','ספקים','סניפים'] },
              { title: 'משאבים', items: ['טיפים ועצות','מבצעים','שירותי חנות','חדשות'] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>{col.title}</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.items.map(it => (
                    <li key={it}>
                      <Link href="#" style={{ fontSize: 14, color: 'var(--gray-400)', transition: 'color 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold-light)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-400)')}
                      >{it}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div style={{ background: 'var(--red)', borderRadius: 16, padding: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 4 }}>BOB</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)', letterSpacing: 3, marginBottom: 20 }}>REWARDS</div>
              <Link href="#" style={{ display: 'block', color: 'var(--gold-light)', fontSize: 13, marginBottom: 8 }}>למד עוד</Link>
              <Link href="#" style={{ display: 'block', color: '#fff', fontSize: 13, fontWeight: 700 }}>הצטרף עכשיו →</Link>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 15, color: '#fff', fontWeight: 600, marginBottom: 12 }}>קבל הצעות בלעדיות וטיפים מקצועיים</div>
              <div style={{ display: 'flex' }}>
                <input type="email" placeholder="הכנס כתובת אימייל" style={{ border: 'none', padding: '11px 18px', fontSize: 14, width: 260, borderRadius: '8px 0 0 8px', fontFamily: 'var(--font)', direction: 'rtl', outline: 'none' }} />
                <button style={{ background: 'var(--gold)', color: 'var(--brown-dark)', border: 'none', padding: '11px 22px', fontWeight: 700, fontSize: 14, borderRadius: '0 8px 8px 0', cursor: 'pointer', fontFamily: 'var(--font)' }}>הצטרף</button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              {['Facebook','Instagram','TikTok','YouTube'].map(s => (
                <Link key={s} href="#" style={{ fontSize: 13, color: 'var(--gray-400)', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold-light)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-400)')}
                >{s}</Link>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '16px 0', textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
            © 2025 בוב חומרי בניין קריית ים. כל הזכויות שמורות.
          </div>
        </div>
      </footer>
    </main>
  );
}
