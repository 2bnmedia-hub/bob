'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Category { id: string; name: string; slug: string; image_url: string; }

function CategoryCard({ cat }: { cat: Category }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={`/category/${cat.slug}`} style={{ textDecoration: 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        borderRadius: 20, overflow: 'hidden', border: `2px solid ${hovered ? 'var(--gold)' : 'var(--gray-200)'}`,
        background: '#fff', transition: 'all 0.25s',
        boxShadow: hovered ? '0 16px 40px rgba(0,0,0,0.15)' : '0 2px 12px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
      }}>
        <div style={{ height: 200, overflow: 'hidden', background: 'var(--gray-100)' }}>
          {cat.image_url && (
            <img src={cat.image_url} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.35s ease', transform: hovered ? 'scale(1.1)' : 'scale(1)' }} />
          )}
        </div>
        <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: hovered ? '#2D6A4F' : '#111', transition: 'color 0.2s' }}>{cat.name}</span>
          <span style={{ fontSize: 18, color: hovered ? 'var(--gold)' : 'var(--gray-300)', transition: 'color 0.2s' }}>←</span>
        </div>
      </div>
    </Link>
  );
}

export default function CategoriesPage() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('categories').select('*').eq('active', true).order('sort_order')
      .then(({ data }) => { setCats(data || []); setLoading(false); });
  }, []);

  return (
    <main style={{ direction: 'rtl', padding: '64px 0', background: 'var(--gray-50)', minHeight: '70vh' }}>
      <div className="container">
        <h1 style={{ fontSize: 36, fontWeight: 900, color: '#111', marginBottom: 12, textAlign: 'center' }}>כל הקטגוריות</h1>
        <p style={{ textAlign: 'center', color: 'var(--gray-600)', marginBottom: 48, fontSize: 16 }}>בחר קטגוריה וגלה את המוצרים שלנו</p>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray-400)' }}>טוען...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
            {cats.map(cat => <CategoryCard key={cat.id} cat={cat} />)}
          </div>
        )}
      </div>
    </main>
  );
}
