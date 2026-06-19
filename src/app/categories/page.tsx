'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Category { id: string; name: string; slug: string; image_url: string; }

export default function CategoriesPage() {
  const [cats, setCats] = useState<Category[]>([]);

  useEffect(() => {
    supabase.from('categories').select('*').eq('active', true).order('sort_order')
      .then(({ data }) => setCats(data || []));
  }, []);

  return (
    <main style={{ direction: 'rtl', padding: '64px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: 36, fontWeight: 900, color: '#111', marginBottom: 40, textAlign: 'center' }}>כל הקטגוריות</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {cats.map(cat => (
            <Link key={cat.id} href={`/category/${cat.slug}`} style={{ textDecoration: 'none', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--gray-200)', display: 'block', transition: 'box-shadow 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              <div style={{ height: 160, background: 'var(--gray-100)', overflow: 'hidden' }}>
                {cat.image_url && <img src={cat.image_url} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
              <div style={{ padding: '16px 20px', fontWeight: 700, fontSize: 16, color: '#111' }}>{cat.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
