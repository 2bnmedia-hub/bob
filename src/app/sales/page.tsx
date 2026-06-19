'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

interface Product {
  id: string; name: string; slug: string;
  price: number; price_was: number;
  images: string[]; brand: string; stock: number;
}

function Stars({ rating }: { rating: number }) {
  return <div style={{ color: 'var(--gold)', fontSize: 13 }}>{[1,2,3,4,5].map(i => <span key={i} style={{ opacity: i <= rating ? 1 : 0.2 }}>★</span>)}</div>;
}

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const img = product.images?.[0] || 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400';
  const discount = product.price_was ? Math.round((1 - product.price / product.price_was) * 100) : 0;

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ border: '1px solid var(--gray-200)', borderRadius: 16, background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'box-shadow 0.25s, transform 0.25s', boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.05)', transform: hovered ? 'translateY(-4px)' : 'translateY(0)' }}>
      <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
        <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: 'var(--gray-100)' }}>
          <img src={img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', transform: hovered ? 'scale(1.06)' : 'scale(1)' }} />
          {discount > 0 && <span style={{ position: 'absolute', top: 10, right: 10, background: 'var(--red)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>-{discount}%</span>}
        </div>
      </Link>
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {product.brand && <div style={{ fontSize: 11, color: 'var(--gray-400)', fontWeight: 600, textTransform: 'uppercase' }}>{product.brand}</div>}
        <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none', fontSize: 14, fontWeight: 600, color: '#111', lineHeight: 1.4 }}>{product.name}</Link>
        <Stars rating={4} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 20, fontWeight: 800 }}>₪{product.price}</span>
          {product.price_was && <span style={{ fontSize: 13, color: 'var(--gray-400)', textDecoration: 'line-through' }}>₪{product.price_was}</span>}
        </div>
        <button onClick={() => { addItem({ id: product.id, name: product.name, price: product.price }); setAdded(true); setTimeout(() => setAdded(false), 1400); }}
          style={{ width: '100%', background: added ? '#1b5e20' : 'transparent', color: added ? '#fff' : 'var(--red)', border: `1.5px solid ${added ? '#1b5e20' : 'var(--red)'}`, fontWeight: 700, fontSize: 14, padding: '10px 0', borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font)', transition: 'all 0.2s' }}>
          {added ? '✓ נוסף לסל' : 'הוסף לסל'}
        </button>
      </div>
    </div>
  );
}

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('products').select('*').eq('on_sale', true).eq('active', true)
      .then(({ data }) => { setProducts(data || []); setLoading(false); });
  }, []);

  return (
    <main style={{ direction: 'rtl' }}>
      <section style={{ background: 'var(--red)', padding: '48px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 42, fontWeight: 900, color: '#fff', marginBottom: 8 }}>מבצעים מיוחדים</h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)' }}>הנחות אטרקטיביות על מוצרים נבחרים</p>
        </div>
      </section>
      <section style={{ padding: '48px 0', background: 'var(--gray-50)' }}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray-400)' }}>טוען מבצעים...</div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: 18, color: 'var(--gray-400)', marginBottom: 16 }}>אין מבצעים פעילים כרגע</div>
              <Link href="/" className="btn-secondary">חזור לדף הבית</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
