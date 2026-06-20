'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type SubSection = 'menu' | 'hero' | 'weekly' | 'gallery' | 'deals' | 'best' | 'categories'

const CARDS = [
  { id: 'hero', icon: '🎯', title: 'סקשן ראשי', desc: 'עריכת הכותרת, תת-כותרת והכפתורים בבאנר העליון', color: '#E3F2FD' },
  { id: 'weekly', icon: '🔥', title: 'מבצעי השבוע', desc: 'עריכת מוצרים ומחירים מיוחדים לשבוע הנוכחי', color: '#FFF3E0' },
  { id: 'gallery', icon: '🖼️', title: 'גלריית תמונות', desc: 'ניהול תמונות המוצגות בגלריה הראשית', color: '#E8F5E9' },
  { id: 'deals', icon: '⚡', title: 'העסקאות הכי שוות', desc: 'בחירת מוצרים להצגה בסקשן העסקאות המובחרות', color: '#FCE4EC' },
  { id: 'best', icon: '💎', title: 'העסקאות הטובות ביותר', desc: 'ניהול רשימת ההצעות הטובות ביותר בדף הבית', color: '#EDE7F6' },
  { id: 'categories', icon: '🗂️', title: 'קטגוריות מובילות', desc: 'סידור וניהול הקטגוריות המוצגות בדף הבית', color: '#E0F7FA' },
]

function HeroEditor() {
  const [slides, setSlides] = useState([
    { title: 'חסכו עד ₪300', sub: 'על מוצרי בנייה נבחרים מהמותגים המובילים', btn: 'לקנייה עכשיו', badge: 'מבצע מיוחד', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=90' },
    { title: 'כלי עבודה מקצועיים', sub: 'מבחר ענק של כלים ממותגים מובילים', btn: 'גלו עכשיו', badge: 'חדש', img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1400&q=90' },
    { title: 'חומרי בניין איכותיים', sub: 'כל מה שצריך לפרויקט — במקום אחד', btn: 'לקטלוג', badge: 'קיץ 2025', img: 'https://images.unsplash.com/photo-1637241612956-b7309005288b?w=1400&q=90' },
  ])
  const [active, setActive] = useState(0)
  const [saved, setSaved] = useState(false)
  function update(field: string, val: string) { setSlides(s => s.map((sl, i) => i === active ? { ...sl, [field]: val } : sl)) }
  function save() { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} style={{ padding: '6px 16px', borderRadius: 8, border: '1px solid #ddd', background: active === i ? '#F0C040' : '#fff', fontWeight: active === i ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>שקופית {i + 1}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[['title','כותרת'],['sub','תת-כותרת'],['btn','טקסט כפתור'],['badge','תגית'],['img','קישור תמונה']].map(([f, l]) => (
          <div key={f} style={{ gridColumn: f === 'img' ? '1/-1' : undefined }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#666', display: 'block', marginBottom: 4 }}>{l}</label>
            <input value={(slides[active] as any)[f]} onChange={e => update(f, e.target.value)}
              style={{ width: '100%', border: '1px solid #ddd', borderRadius: 8, padding: '8px 12px', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const }} />
          </div>
        ))}
      </div>
      {slides[active].img && <img src={slides[active].img} alt="preview" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 10, marginTop: 16 }} />}
      <button onClick={save} style={{ marginTop: 16, background: '#2D6A4F', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{saved ? '✓ נשמר!' : 'שמור שינויים'}</button>
    </div>
  )
}

function ProductsEditor({ title }: { title: string }) {
  const [products, setProducts] = useState([{ id: '1', name: '', price: '', was: '', img: '' }])
  const [saved, setSaved] = useState(false)
  function update(i: number, field: string, val: string) { setProducts(p => p.map((pr, idx) => idx === i ? { ...pr, [field]: val } : pr)) }
  function add() { setProducts(p => [...p, { id: Date.now().toString(), name: '', price: '', was: '', img: '' }]) }
  function remove(i: number) { setProducts(p => p.filter((_, idx) => idx !== i)) }
  function save() { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        {products.map((p, i) => (
          <div key={p.id} style={{ background: '#f9f9f9', border: '1px solid #eee', borderRadius: 10, padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>מוצר {i + 1}</span>
              <button onClick={() => remove(i)} style={{ background: '#fee', border: 'none', color: '#e33', borderRadius: 6, padding: '2px 10px', cursor: 'pointer', fontFamily: 'inherit' }}>הסר</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[['name','שם מוצר'],['price','מחיר'],['was','מחיר מקורי'],['img','קישור תמונה']].map(([f, l]) => (
                <div key={f} style={{ gridColumn: f === 'name' || f === 'img' ? '1/-1' : undefined }}>
                  <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 3 }}>{l}</label>
                  <input value={(p as any)[f]} onChange={e => update(i, f, e.target.value)}
                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: 6, padding: '7px 10px', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={add} style={{ background: '#fff', border: '1px dashed #ddd', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>+ הוסף מוצר</button>
        <button onClick={save} style={{ background: '#2D6A4F', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{saved ? '✓ נשמר!' : 'שמור'}</button>
      </div>
    </div>
  )
}

function CategoriesEditor() {
  const [cats, setCats] = useState([
    { name: 'בניין ושיפוץ', href: '/category/building', img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=90' },
    { name: 'כלי עבודה', href: '/category/tools', img: 'https://images.unsplash.com/photo-1426927308491-6380b6a9936f?w=800&q=90' },
    { name: 'חשמל', href: '/category/electric', img: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&q=90' },
    { name: 'צבע וגימור', href: '/category/paint', img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=90' },
    { name: 'אינסטלציה', href: '/category/plumbing', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=90' },
  ])
  const [saved, setSaved] = useState(false)
  function update(i: number, field: string, val: string) { setCats(c => c.map((cat, idx) => idx === i ? { ...cat, [field]: val } : cat)) }
  function save() { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        {cats.map((cat, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 10, background: '#f9f9f9', borderRadius: 8, padding: 12 }}>
            {[['name','שם'],['href','קישור'],['img','תמונה']].map(([f, l]) => (
              <div key={f}>
                <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 3 }}>{l}</label>
                <input value={(cat as any)[f]} onChange={e => update(i, f, e.target.value)}
                  style={{ width: '100%', border: '1px solid #ddd', borderRadius: 6, padding: '6px 10px', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const }} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={save} style={{ background: '#2D6A4F', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{saved ? '✓ נשמר!' : 'שמור'}</button>
    </div>
  )
}

function GalleryEditor() {
  const [images, setImages] = useState<{id:string;url:string;title:string}[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    supabase.from('gallery').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setImages(data); setLoading(false)
    })
  }, [])
  async function remove(img: any) {
    const fileName = img.url.split('/').pop()
    await supabase.storage.from('gallery').remove([fileName])
    await supabase.from('gallery').delete().eq('id', img.id)
    setImages(i => i.filter(x => x.id !== img.id))
  }
  if (loading) return <div style={{ color: '#aaa', padding: 40, textAlign: 'center' }}>טוען...</div>
  return (
    <div>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>להעלאת תמונות חדשות — עבור לדף גלריית תמונות הציבורי</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
        {images.map(img => (
          <div key={img.id} style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #eee' }}>
            <img src={img.url} alt={img.title} style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
            <div style={{ padding: '6px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 90 }}>{img.title}</span>
              <button onClick={() => remove(img)} style={{ background: '#fee', border: 'none', color: '#e33', borderRadius: 4, padding: '2px 8px', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}>מחק</button>
            </div>
          </div>
        ))}
        {images.length === 0 && <div style={{ color: '#aaa', gridColumn: '1/-1', textAlign: 'center', padding: 40 }}>אין תמונות</div>}
      </div>
    </div>
  )
}

export default function HomepageSection() {
  const [sub, setSub] = useState<SubSection>('menu')
  const current = CARDS.find(c => c.id === sub)
  if (sub === 'menu') {
    return (
      <div style={{ padding: 24, direction: 'rtl' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#222', marginBottom: 8 }}>ניהול דף הבית</h2>
        <p style={{ fontSize: 14, color: '#888', marginBottom: 28 }}>בחר סקשן לעריכה</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {CARDS.map(card => (
            <div key={card.id} onClick={() => setSub(card.id as SubSection)}
              style={{ background: '#fff', border: '1px solid #eee', borderRadius: 14, padding: 20, cursor: 'pointer', display: 'flex', gap: 16, alignItems: 'flex-start', transition: 'box-shadow 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{card.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#222', marginBottom: 6 }}>{card.title}</div>
                <div style={{ fontSize: 13, color: '#888', lineHeight: 1.5 }}>{card.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div style={{ padding: 24, direction: 'rtl' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => setSub('menu')} style={{ background: '#f5f5f5', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>← חזור</button>
        <div style={{ fontSize: 22 }}>{current?.icon}</div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#222', margin: 0 }}>{current?.title}</h2>
      </div>
      <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 14, padding: 24 }}>
        {sub === 'hero' && <HeroEditor />}
        {sub === 'weekly' && <ProductsEditor title="מבצעי השבוע" />}
        {sub === 'deals' && <ProductsEditor title="העסקאות הכי שוות" />}
        {sub === 'best' && <ProductsEditor title="העסקאות הטובות ביותר" />}
        {sub === 'gallery' && <GalleryEditor />}
        {sub === 'categories' && <CategoriesEditor />}
      </div>
    </div>
  )
}
