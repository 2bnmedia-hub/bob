'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import { ArrowRight, SlidersHorizontal, Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  price_was: number;
  images: string[];
  brand: string;
  stock: number;
  on_sale: boolean;
  featured: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ color: 'var(--gold)', fontSize: 13, display: 'flex' }}>
      {[1,2,3,4,5].map(i => <span key={i} style={{ opacity: i <= rating ? 1 : 0.2 }}>★</span>)}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  function handleAdd() {
    addItem({ id: product.id, name: product.name, price: product.price });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  const img = product.images?.[0] || 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400';
  const discount = product.price_was ? Math.round((1 - product.price / product.price_was) * 100) : 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: '1px solid var(--gray-200)', borderRadius: 16, background: '#fff',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transition: 'box-shadow 0.25s, transform 0.25s',
        boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.05)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
        <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: 'var(--gray-100)' }}>
          <img src={img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', transform: hovered ? 'scale(1.06)' : 'scale(1)' }} />
          {product.on_sale && discount > 0 && (
            <span style={{ position: 'absolute', top: 10, right: 10, background: 'var(--red)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>-{discount}%</span>
          )}
          {product.stock === 0 && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--gray-600)' }}>אזל המלאי</div>
          )}
        </div>
      </Link>
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {product.brand && <div style={{ fontSize: 11, color: 'var(--gray-400)', fontWeight: 600, textTransform: 'uppercase' }}>{product.brand}</div>}
        <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)', lineHeight: 1.4, minHeight: 40 }}>{product.name}</div>
        </Link>
        <Stars rating={4} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 20, fontWeight: 800 }}>₪{product.price}</span>
          {product.price_was && <span style={{ fontSize: 13, color: 'var(--gray-400)', textDecoration: 'line-through' }}>₪{product.price_was}</span>}
        </div>
        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          style={{ width: '100%', background: added ? '#1b5e20' : 'transparent', color: added ? '#fff' : 'var(--red)', border: `1.5px solid ${added ? '#1b5e20' : 'var(--red)'}`, fontWeight: 700, fontSize: 14, padding: '10px 0', borderRadius: 8, cursor: product.stock === 0 ? 'not-allowed' : 'pointer', fontFamily: 'var(--font)', transition: 'all 0.2s', opacity: product.stock === 0 ? 0.5 : 1 }}
        >
          {added ? '✓ נוסף לסל' : product.stock === 0 ? 'אזל המלאי' : 'הוסף לסל'}
        </button>
      </div>
    </div>
  );
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('created_at');
  

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: cat } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();
      setCategory(cat);

      if (cat) {
        const { data: prods } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', cat.id)
          .eq('active', true)
          .order(sort, { ascending: sort === 'price' });
        setProducts(prods || []);
      }
      setLoading(false);
    }
    load();
  }, [slug, sort]);

  if (loading) return (
    <main style={{ direction: 'rtl', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 16, color: 'var(--gray-400)' }}>טוען...</div>
    </main>
  );

  if (!category) return (
    <main style={{ direction: 'rtl', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div style={{ fontSize: 24, fontWeight: 700 }}>קטגוריה לא נמצאה</div>
      <Link href="/" className="btn-secondary">חזור לדף הבית</Link>
    </main>
  );

  return (
    <main style={{ direction: 'rtl' }}>

      {/* HERO */}
      <section style={{ position: 'relative', height: 220, overflow: 'hidden', background: 'var(--brown-dark)' }}>
        {category.image_url && <img src={category.image_url} alt={category.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />}
        <div className="container" style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>דף הבית</Link>
            <ArrowRight size={14} color="rgba(255,255,255,0.4)" />
            <span style={{ color: '#fff', fontSize: 13 }}>{category.name}</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: '#fff' }}>{category.name}</h1>
          {category.description && <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', marginTop: 8 }}>{category.description}</p>}
        </div>
      </section>

      {/* CONTENT */}
      <section style={{ padding: '32px 0' }}>
        <div className="container">

          {/* TOOLBAR */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 14, color: 'var(--gray-600)' }}>{products.length} מוצרים</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <SlidersHorizontal size={16} color="var(--gray-600)" />
              <select value={sort} onChange={e => setSort(e.target.value)} style={{ border: '1px solid var(--gray-200)', borderRadius: 8, padding: '7px 12px', fontSize: 13, fontFamily: 'var(--font)', outline: 'none', cursor: 'pointer' }}>
                <option value="created_at">חדש ביותר</option>
                <option value="price">מחיר: נמוך לגבוה</option>
                <option value="name">לפי שם</option>
              </select>
            </div>
          </div>

          {/* PRODUCTS GRID */}
          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray-400)', fontSize: 16 }}>
              אין מוצרים בקטגוריה זו כרגע
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
