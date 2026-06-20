'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import ImageUploadWithCrop from '@/components/ImageUploadWithCrop'

const DEFAULT_HERO = [
  { title: 'חסכו עד ₪300', titleColor: '#ffffff', sub: 'על מוצרי בנייה נבחרים מהמותגים המובילים', subColor: '#ffffff', btn: 'לקנייה עכשיו', btnColor: '#111111', badge: 'מבצע מיוחד', badgeColor: '#111111', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=90', overlay: 'rgba(50,30,15,0.45)' },
  { title: 'כלי עבודה מקצועיים', titleColor: '#ffffff', sub: 'מבחר ענק של כלים ממותגים מובילים', subColor: '#ffffff', btn: 'גלו עכשיו', btnColor: '#111111', badge: 'חדש', badgeColor: '#111111', img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1400&q=90', overlay: 'rgba(20,20,20,0.5)' },
  { title: 'חומרי בניין איכותיים', titleColor: '#ffffff', sub: 'כל מה שצריך לפרויקט — במקום אחד', subColor: '#ffffff', btn: 'לקטלוג', btnColor: '#111111', badge: 'קיץ 2025', badgeColor: '#111111', img: 'https://images.unsplash.com/photo-1637241612956-b7309005288b?w=1400&q=90', overlay: 'rgba(30,50,15,0.5)' },
]

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16)
  return `rgba(${r},${g},${b},${alpha})`
}

function rgbaToHex(rgba: string) {
  const m = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!m) return '#000000'
  return '#' + [m[1],m[2],m[3]].map(x => parseInt(x).toString(16).padStart(2,'0')).join('')
}

function rgbaToAlpha(rgba: string) {
  const m = rgba.match(/rgba?\([^,]+,[^,]+,[^,]+,\s*([\d.]+)/)
  return m ? parseFloat(m[1]) : 0.45
}

function TextWithColor({ label, value, color, onValue, onColor }: { label: string; value: string; color: string; onValue: (v: string) => void; onColor: (v: string) => void }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: '#666', display: 'block', marginBottom: 4 }}>{label}</label>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input value={value} onChange={e => onValue(e.target.value)}
          style={{ flex: 1, border: '1px solid #ddd', borderRadius: 8, padding: '8px 12px', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <span style={{ fontSize: 10, color: '#aaa' }}>צבע</span>
          <input type="color" value={color} onChange={e => onColor(e.target.value)}
            style={{ width: 36, height: 32, border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer', padding: 2 }} />
        </div>
      </div>
    </div>
  )
}

export default function HeroEditor() {
  const [slides, setSlides] = useState(DEFAULT_HERO)
  const [active, setActive] = useState(0)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.from('homepage_content').select('value').eq('key','hero').single().then(({ data }) => {
      if (data?.value) setSlides(data.value)
      setLoading(false)
    })
  }, [])

  function update(field: string, val: string) {
    setSlides(s => s.map((sl, i) => i === active ? { ...sl, [field]: val } : sl))
  }

  function addSlide() {
    setSlides(s => [...s, { title: 'כותרת חדשה', titleColor: '#ffffff', sub: 'תת-כותרת', subColor: '#ffffff', btn: 'לחץ כאן', btnColor: '#111111', badge: 'חדש', badgeColor: '#111111', img: '', overlay: 'rgba(30,30,30,0.45)' }])
    setActive(slides.length)
  }

  function removeSlide(i: number) {
    if (slides.length === 1) return
    setSlides(s => s.filter((_, idx) => idx !== i))
    setActive(Math.max(0, i - 1))
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fileName = `hero_${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('gallery').upload(fileName, file)
    if (!error) {
      const { data } = supabase.storage.from('gallery').getPublicUrl(fileName)
      update('img', data.publicUrl)
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function save() {
    await supabase.from('homepage_content').upsert({ key: 'hero', value: slides, updated_at: new Date().toISOString() })
    setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <div style={{ color: '#aaa', padding: 40, textAlign: 'center', minHeight: 200 }}>טוען...</div>

  const slide = slides[active]
  const overlayHex = rgbaToHex(slide.overlay)
  const overlayAlpha = rgbaToAlpha(slide.overlay)

  return (
    <div>
      {/* TABS */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        {slides.map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button onClick={() => setActive(i)} style={{ padding: '6px 16px', borderRadius: 8, border: '1px solid #ddd', background: active === i ? '#F0C040' : '#fff', fontWeight: active === i ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>
              שקופית {i + 1}
            </button>
            {slides.length > 1 && (
              <button onClick={() => removeSlide(i)} style={{ background: '#fee', border: 'none', color: '#e33', borderRadius: 6, width: 24, height: 24, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            )}
          </div>
        ))}
        <button onClick={addSlide} style={{ padding: '6px 14px', borderRadius: 8, border: '1px dashed #ddd', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 18, color: '#888' }}>+</button>
      </div>

      {/* FIELDS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <TextWithColor label="כותרת" value={slide.title} color={slide.titleColor || '#ffffff'} onValue={v => update('title', v)} onColor={v => update('titleColor', v)} />
        <TextWithColor label="תת-כותרת" value={slide.sub} color={slide.subColor || '#ffffff'} onValue={v => update('sub', v)} onColor={v => update('subColor', v)} />
        <TextWithColor label="טקסט כפתור" value={slide.btn} color={slide.btnColor || '#111111'} onValue={v => update('btn', v)} onColor={v => update('btnColor', v)} />
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 4 }}>קישור כפתור</label>
          <input value={(slide as any).btnHref || ""} onChange={e => update("btnHref", e.target.value)} placeholder="להדביק לפה בבקשה את לינק הדף שתרצו שיעלה בעת לחיצה על הכפתור" style={{ width: "100%", border: "1px solid #ddd", borderRadius: 8, padding: "8px 12px", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
        </div>
        <TextWithColor label="תגית" value={slide.badge} color={slide.badgeColor || '#111111'} onValue={v => update('badge', v)} onColor={v => update('badgeColor', v)} />

        {/* IMAGE */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#666', display: 'block', marginBottom: 4 }}>תמונה</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input value={slide.img} onChange={e => update('img', e.target.value)} placeholder="הכנס קישור תמונה"
              style={{ flex: 1, border: '1px solid #ddd', borderRadius: 8, padding: '8px 12px', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
            <span style={{ fontSize: 12, color: '#aaa' }}>או</span>
            <ImageUploadWithCrop value={slide.img} onChange={v => update('img', v)} aspect={16/7} />
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              style={{ background: '#F0C040', color: '#111', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
              {uploading ? '...' : '+ העלה'}
            </button>
          </div>
          {slide.img && <img src={slide.img} alt="preview" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 10, marginTop: 10 }} />}
        </div>

        {/* OVERLAY */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#666', display: 'block', marginBottom: 8 }}>צבע כיסוי (overlay)</label>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', background: '#f9f9f9', borderRadius: 10, padding: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>צבע</div>
              <input type="color" value={overlayHex} onChange={e => update('overlay', hexToRgba(e.target.value, overlayAlpha))}
                style={{ width: 48, height: 40, border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer', padding: 2 }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>שקיפות: {Math.round(overlayAlpha * 100)}%</div>
              <input type="range" min={0} max={1} step={0.05} value={overlayAlpha}
                onChange={e => update('overlay', hexToRgba(overlayHex, parseFloat(e.target.value)))}
                style={{ width: '100%' }} />
            </div>
            <div style={{ width: 60, height: 40, borderRadius: 8, background: slide.overlay, border: '1px solid #ddd' }} />
          </div>
        </div>
      </div>

      <button onClick={save} style={{ marginTop: 20, background: '#2D6A4F', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
        {saved ? '✓ נשמר!' : 'שמור שינויים'}
      </button>
    </div>
  )
}
