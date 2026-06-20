'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface GalleryImage { id: string; url: string; title: string }

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [active, setActive] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('gallery').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setImages(data)
      setLoading(false)
    })
  }, [])

  const prev = useCallback(() => setActive(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setActive(i => (i + 1) % images.length), [images.length])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'ArrowLeft') next(); if (e.key === 'ArrowRight') prev() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [prev, next])

  useEffect(() => {
    if (images.length === 0) return
    const t = setInterval(next, 4000)
    return () => clearInterval(t)
  }, [images.length, next])

  return (
    <main style={{ direction: 'rtl', minHeight: '80vh', padding: '40px var(--px)', maxWidth: 'var(--max-w)', margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--brown)', marginBottom: 8 }}>גלריית תמונות</h1>
      <p style={{ color: 'var(--gray-400)', fontSize: 14, marginBottom: 36 }}>תמונות מהחנות והפרויקטים שלנו</p>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 80, color: '#aaa' }}>טוען...</div>
      ) : images.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80, color: '#aaa' }}>הגלריה ריקה כרגע</div>
      ) : (
        <>
          <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', background: '#111', marginBottom: 20, aspectRatio: '16/7' }}>
            <img src={images[active].url} alt={images[active].title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.4s', display: 'block' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.6))', padding: '32px 24px 20px' }}>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{images[active].title}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 4 }}>{active + 1} / {images.length}</div>
            </div>
            <button onClick={prev} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: 44, height: 44, fontSize: 20, cursor: 'pointer' }}>›</button>
            <button onClick={next} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: 44, height: 44, fontSize: 20, cursor: 'pointer' }}>‹</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
            {images.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} style={{ width: i === active ? 24 : 8, height: 8, borderRadius: 4, background: i === active ? 'var(--brown)' : '#ddd', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
            {images.map((img, i) => (
              <div key={img.id} onClick={() => setActive(i)} style={{ borderRadius: 12, overflow: 'hidden', cursor: 'pointer', border: i === active ? '3px solid var(--brown)' : '3px solid transparent', transition: 'border 0.2s', aspectRatio: '1' }}>
                <img src={img.url} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  )
}
