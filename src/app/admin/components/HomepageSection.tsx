'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import ImageUploadWithCrop from '@/components/ImageUploadWithCrop'
import HeroEditor from './HeroEditor'

type SubSection = 'menu' | 'hero' | 'weekly' | 'gallery' | 'deals' | 'best' | 'categories'

const CARDS = [
  { id: 'hero', icon: '🎯', title: 'סקשן ראשי', desc: 'עריכת הכותרת, תת-כותרת והכפתורים בבאנר העליון', color: '#E3F2FD' },
  { id: 'weekly', icon: '🔥', title: 'מבצעי השבוע', desc: 'עריכת מוצרים ומחירים מיוחדים לשבוע הנוכחי', color: '#FFF3E0' },
  { id: 'gallery', icon: '🖼️', title: 'גלריית תמונות', desc: 'ניהול תמונות המוצגות בגלריה הראשית', color: '#E8F5E9' },
  { id: 'deals', icon: '⚡', title: 'העסקאות הכי שוות', desc: 'בחירת מוצרים להצגה בסקשן העסקאות המובחרות', color: '#FCE4EC' },
  { id: 'best', icon: '💎', title: 'העסקאות הטובות ביותר', desc: 'ניהול רשימת ההצעות הטובות ביותר בדף הבית', color: '#EDE7F6' },
  { id: 'categories', icon: '🗂️', title: 'קטגוריות מובילות', desc: 'סידור וניהול הקטגוריות המוצגות בדף הבית', color: '#E0F7FA' },
]

const DEFAULT_PRODUCTS = [{ id: '1', name: '', price: '', was: '', img: '' }]
const DEFAULT_CATEGORIES = [
  { name: 'בניין ושיפוץ', href: '/category/building', img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=90' },
  { name: 'כלי עבודה', href: '/category/tools', img: 'https://images.unsplash.com/photo-1426927308491-6380b6a9936f?w=800&q=90' },
  { name: 'חשמל', href: '/category/electric', img: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&q=90' },
  { name: 'צבע וגימור', href: '/category/paint', img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=90' },
  { name: 'אינסטלציה', href: '/category/plumbing', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=90' },
]

async function loadKey(key: string) {
  const { data } = await supabase.from('homepage_content').select('value').eq('key', key).single()
  return data?.value ?? null
}

async function saveKey(key: string, value: any) {
  await supabase.from('homepage_content').upsert({ key, value, updated_at: new Date().toISOString() })
}

function ImageInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fileName = `img_${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('gallery').upload(fileName, file)
    if (!error) {
      const { data } = supabase.storage.from('gallery').getPublicUrl(fileName)
      onChange(data.publicUrl)
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input value={value} onChange={e => onChange(e.target.value)} placeholder="הכנס קישור תמונה"
          style={{ flex: 1, border: '1px solid #ddd', borderRadius: 6, padding: '7px 10px', fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
        <span style={{ fontSize: 12, color: '#aaa' }}>או</span>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} style={{ display: 'none' }} />
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          style={{ background: '#F0C040', color: '#111', border: 'none', borderRadius: 6, padding: '7px 14px', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
          {uploading ? '...' : '+ העלה'}
        </button>
      </div>
      {value && <img src={value} alt="preview" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8, marginTop: 8 }} />}
    </div>
  )
}

function ProductsEditor({ dbKey }: { dbKey: string }) {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadKey(dbKey).then(v => { if (v) setProducts(v); setLoading(false) }) }, [dbKey])

  function update(i: number, field: string, val: string) { setProducts(p => p.map((pr, idx) => idx === i ? { ...pr, [field]: val } : pr)) }
  function add() { setProducts(p => [...p, { id: Date.now().toString(), name: '', price: '', was: '', img: '' }]) }
  function remove(i: number) { setProducts(p => p.filter((_, idx) => idx !== i)) }
  async function save() { await saveKey(dbKey, products); setSaved(true); setTimeout(() => setSaved(false), 2000) }

  if (loading) return <div style={{ color: '#aaa', padding: 40, textAlign: 'center' }}>טוען...</div>

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start', direction: 'rtl' }}>
      {/* EDITOR */}
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
          {products.map((p, i) => (
            <div key={p.id} style={{ background: '#f9f9f9', border: '1px solid #eee', borderRadius: 10, padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>מוצר {i + 1}</span>
                <button onClick={() => remove(i)} style={{ background: '#fee', border: 'none', color: '#e33', borderRadius: 6, padding: '2px 10px', cursor: 'pointer', fontFamily: 'inherit' }}>הסר</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[['name','שם מוצר'],['price','מחיר'],['was','מחיר מקורי'],['href','לינק למוצר']].map(([f, l]) => (
                  <div key={f}>
                    <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 3 }}>{l}</label>
                    <input value={(p as any)[f]} onChange={e => update(i, f, e.target.value)} placeholder={f === 'href' ? 'להדביק לפה את לינק הדף שתרצו שיעלה בעת לחיצה על המוצר' : ''}
                      style={{ width: '100%', border: '1px solid #ddd', borderRadius: 6, padding: '7px 10px', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const }} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 3 }}>תמונה</label>
                  <ImageUploadWithCrop value={p.img} onChange={v => update(i, 'img', v)} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={add} style={{ background: '#fff', border: '1px dashed #ddd', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>+ הוסף מוצר</button>
          <button onClick={save} style={{ background: '#2D6A4F', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{saved ? '✓ נשמר!' : 'שמור'}</button>
        </div>
      </div>

      {/* PREVIEW */}
      <div style={{ position: 'sticky', top: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#888', marginBottom: 12 }}>תצוגה מקדימה</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {products.filter(p => p.name).map((p, i) => (
            <div key={i} style={{ border: '1px solid #eee', borderRadius: 12, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ height: 120, background: '#f5f5f5', overflow: 'hidden' }}>
                {p.img ? <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: 28 }}>📦</div>}
              </div>
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#222', marginBottom: 6, lineHeight: 1.3 }}>{p.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#222' }}>₪{p.price}</span>
                  {p.was && <span style={{ fontSize: 12, color: '#aaa', textDecoration: 'line-through' }}>₪{p.was}</span>}
                  {p.price && p.was && <span style={{ fontSize: 11, color: '#e33', fontWeight: 700 }}>-{Math.round((1 - Number(p.price)/Number(p.was))*100)}%</span>}
                </div>
              </div>
            </div>
          ))}
          {products.filter(p => p.name).length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#ccc', padding: 40, fontSize: 13 }}>הוסף מוצרים כדי לראות תצוגה מקדימה</div>
          )}
        </div>
      </div>
    </div>
  )
}

function CategoriesEditor() {
  const [cats, setCats] = useState(DEFAULT_CATEGORIES)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadKey('categories').then(v => { if (v) setCats(v); setLoading(false) }) }, [])

  function update(i: number, field: string, val: string) { setCats(c => c.map((cat, idx) => idx === i ? { ...cat, [field]: val } : cat)) }
  async function save() { await saveKey('categories', cats); setSaved(true); setTimeout(() => setSaved(false), 2000) }

  if (loading) return <div style={{ color: '#aaa', padding: 40, textAlign: 'center' }}>טוען...</div>

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        {cats.map((cat, i) => (
          <div key={i} style={{ background: '#f9f9f9', borderRadius: 8, padding: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              {[['name','שם'],['href','קישור']].map(([f, l]) => (
                <div key={f}>
                  <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 3 }}>{l}</label>
                  <input value={(cat as any)[f]} onChange={e => update(i, f, e.target.value)}
                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: 6, padding: '6px 10px', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const }} />
                </div>
              ))}
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 3 }}>תמונה</label>
              <ImageUploadWithCrop value={cat.img} onChange={v => update(i, 'img', v)} />
            </div>
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
  const [title, setTitle] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function load() {
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false })
    if (data) setImages(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []); if (!files.length) return
    setUploading(true)
    for (const file of files) {
      const fileName = `gallery_${Date.now()}_${Math.random().toString(36).slice(2)}.${file.name.split('.').pop()}`
      const { error } = await supabase.storage.from('gallery').upload(fileName, file)
      if (!error) {
        const { data } = supabase.storage.from('gallery').getPublicUrl(fileName)
        await supabase.from('gallery').insert({ url: data.publicUrl, title: title || file.name })
      }
    }
    setTitle('')
    if (fileRef.current) fileRef.current.value = ''
    await load()
    setUploading(false)
  }

  async function remove(img: any) {
    const fileName = img.url.split('/').pop()
    await supabase.storage.from('gallery').remove([fileName])
    await supabase.from('gallery').delete().eq('id', img.id)
    setImages(i => i.filter(x => x.id !== img.id))
  }

  if (loading) return <div style={{ color: '#aaa', padding: 40, textAlign: 'center' }}>טוען...</div>

  return (
    <div>
      <div style={{ background: '#f9f9f9', border: '1px solid #eee', borderRadius: 10, padding: 16, marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>העלאת תמונה חדשה</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <input type="text" placeholder="כותרת תמונה (אופציונלי)" value={title} onChange={e => setTitle(e.target.value)}
            style={{ border: '1px solid #ddd', borderRadius: 8, padding: '7px 12px', fontSize: 13, fontFamily: 'inherit', width: 200, outline: 'none' }} />
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} style={{ display: 'none' }} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            style={{ background: '#F0C040', color: '#111', border: 'none', borderRadius: 8, padding: '7px 18px', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
            {uploading ? 'מעלה...' : '+ בחר תמונה'}
          </button>
        </div>
      </div>
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
        {sub === 'weekly' && <ProductsEditor dbKey="weekly" />}
        {sub === 'deals' && <ProductsEditor dbKey="deals" />}
        {sub === 'best' && <ProductsEditor dbKey="best" />}
        {sub === 'gallery' && <GalleryEditor />}
        {sub === 'categories' && <CategoriesEditor />}
      </div>
    </div>
  )
}
