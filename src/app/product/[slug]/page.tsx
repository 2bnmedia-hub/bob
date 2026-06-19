'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import { ArrowRight, ShoppingCart, Package, Shield, Truck } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  price_was: number;
  images: string[];
  brand: string;
  stock: number;
  sku: string;
  on_sale: boolean;
  attributes: Record<string, string>;
  categories: { name: string; slug: string };
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const { addItem } = useCart();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('products')
        .select('*, categories(name, slug)')
        .eq('slug', slug)
        .single();
      setProduct(data);
      setLoading(false);
    }
    load();
  }, [slug]);

  function handleAdd() {
    if (!product) return;
    for (let i = 0; i < qty; i++) addItem({ id: product.id, name: product.name, price: product.price });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (loading) return (
    <main style={{ direction: 'rtl', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 16, color: 'var(--gray-400)' }}>טוען...</div>
    </main>
  );

  if (!product) return (
    <main style={{ direction: 'rtl', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div style={{ fontSize: 24, fontWeight: 700 }}>מוצר לא נמצא</div>
      <Link href="/" className="btn-secondary">חזור לדף הבית</Link>
    </main>
  );

  const images = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600'];
  const discount = product.price_was ? Math.round((1 - product.price / product.price_was) * 100) : 0;

  return (
    <main style={{ direction: 'rtl', padding: '32px 0' }}>
      <div className="container">

        {/* BREADCRUMB */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: 13, color: 'var(--gray-400)' }}>
          <Link href="/" style={{ color: 'var(--gray-400)' }}>דף הבית</Link>
          <ArrowRight size={13} />
          {product.categories && (
            <>
              <Link href={`/category/${product.categories.slug}`} style={{ color: 'var(--gray-400)' }}>{product.categories.name}</Link>
              <ArrowRight size={13} />
            </>
          )}
          <span style={{ color: 'var(--gray-800)' }}>{product.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, alignItems: 'start' }}>

          {/* IMAGES */}
          <div>
            <div style={{ borderRadius: 20, overflow: 'hidden', height: 460, background: 'var(--gray-100)', marginBottom: 12 }}>
              <img src={images[activeImg]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8 }}>
                {images.map((img, i) => (
                  <div key={i} onClick={() => setActiveImg(i)} style={{ width: 80, height: 80, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', border: `2px solid ${i === activeImg ? 'var(--gold)' : 'var(--gray-200)'}`, transition: 'border-color 0.2s' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* INFO */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {product.brand && (
              <div style={{ fontSize: 12, color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>{product.brand}</div>
            )}
            <h1 style={{ fontSize: 30, fontWeight: 900, color: 'var(--brown-dark)', lineHeight: 1.3 }}>{product.name}</h1>

            {/* PRICE */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontSize: 38, fontWeight: 900, color: 'var(--gray-800)' }}>₪{product.price}</span>
              {product.price_was && <span style={{ fontSize: 20, color: 'var(--gray-400)', textDecoration: 'line-through' }}>₪{product.price_was}</span>}
              {discount > 0 && (
                <span style={{ background: 'var(--red)', color: '#fff', fontSize: 13, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>-{discount}%</span>
              )}
            </div>

            {/* STOCK */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Package size={16} color={product.stock > 0 ? '#2D6A4F' : 'var(--gray-400)'} />
              <span style={{ fontSize: 14, color: product.stock > 0 ? '#2D6A4F' : 'var(--gray-400)', fontWeight: 600 }}>
                {product.stock > 0 ? `במלאי — ${product.stock} יחידות` : 'אזל המלאי'}
              </span>
            </div>

            {product.description && (
              <p style={{ fontSize: 15, color: 'var(--gray-600)', lineHeight: 1.8, borderTop: '1px solid var(--gray-200)', paddingTop: 20 }}>
                {product.description}
              </p>
            )}

            {/* QTY + ADD */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--gray-200)', borderRadius: 10, overflow: 'hidden' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 44, height: 48, border: 'none', background: 'var(--gray-50)', fontSize: 20, cursor: 'pointer', fontWeight: 700, transition: 'background 0.15s' }}>−</button>
                <span style={{ width: 48, textAlign: 'center', fontSize: 16, fontWeight: 700 }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock || 99, q + 1))} style={{ width: 44, height: 48, border: 'none', background: 'var(--gray-50)', fontSize: 20, cursor: 'pointer', fontWeight: 700, transition: 'background 0.15s' }}>+</button>
              </div>
              <button
                onClick={handleAdd}
                disabled={product.stock === 0}
                style={{ flex: 1, background: added ? '#1b5e20' : 'var(--red)', color: '#fff', border: 'none', fontWeight: 700, fontSize: 16, padding: '14px 0', borderRadius: 10, cursor: product.stock === 0 ? 'not-allowed' : 'pointer', fontFamily: 'var(--font)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: product.stock === 0 ? 0.6 : 1 }}
              >
                <ShoppingCart size={20} />
                {added ? 'נוסף לסל!' : product.stock === 0 ? 'אזל המלאי' : 'הוסף לסל'}
              </button>
            </div>

            {/* TRUST BADGES */}
            <div style={{ background: 'var(--gray-50)', borderRadius: 14, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {([
                [Truck, 'משלוח חינם מעל ₪400'],
                [Shield, 'אחריות יצרן מלאה'],
                [Package, 'החזרה קלה תוך 30 יום'],
              ] as const).map(([Icon, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--gray-600)', fontWeight: 500 }}>
                  <Icon size={18} strokeWidth={1.8} color="var(--brown)" />
                  {text}
                </div>
              ))}
            </div>

            {product.sku && (
              <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>מק״ט: {product.sku}</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
