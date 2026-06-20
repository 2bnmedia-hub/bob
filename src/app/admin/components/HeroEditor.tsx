'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

const DEFAULT_HERO = [
  { title: 'חסכו עד ₪300', titleColor: '#ffffff', sub: 'על מוצרי בנייה נבחרים מהמותגים המובילים', subColor: '#ffffff', btn: 'לקנייה עכשיו', btnColor: '#111111', btnHref: '', badge: 'מבצע מיוחד', badgeColor: '#111111', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=90', overlay: 'rgba(50,30,15,0.45)' },
  { title: 'כלי עבודה מקצועיים', titleColor: '#ffffff', sub: 'מבחר ענק של כלים ממותגים מובילים', subColor: '#ffffff', btn: 'גלו עכשיו', btnColor: '#111111', btnHref: '', badge: 'חדש', badgeColor: '#111111', img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1400&q=90', overlay: 'rgba(20,20,20,0.5)' },
  { title: 'חומרי בניין איכותיים', titleColor: '#ffffff', sub: 'כל מה שצריך לפרויקט — במקום אחד', subColor: '#ffffff', btn: 'לקטלוג', btnColor: '#111111', btnHref: '', badge: 'קיץ 2025', badgeColor: '#111111', img: 'https://images.unsplash.com/photo-1637241612956-b7309005288b?w=1400&q=90', overlay: 'rgba(30,50,15,0.5)' },
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

function Row({ label, value, color, onValue, onColor, href, onHref }: { label: string; value: string; color: string; onValue: (v: string) => void; onColor: (v: string) => void; href?: string; onHref?: (v: string) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: href !== undefined ? '1fr 36px 1fr' : '1fr 36px', gap: 8, alignItems: 'end' }}>
      <div>
        <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 3 }}>{label}</label>
        <input value={value} onChange={e => onValue(e.target.value)}
          style={{ width: '100%', border: '1px solid #ddd', borderRadius: 7, padding: '7px 10px', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const }} />
      </div>
      <div style={{ paddingBottom: 1 }}>
        <div style={{ fontSize: 10, color: '#bbb', textAlign: 'center', marginBottom: 3 }}>צבע</div>
        <input type="color" value={color} onChange={e => onColor(e.target.value)}
          style={{ width: 36, height: 34, border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer', padding: 2, display: 'block' }} />
      </div>
      {href !== undefined && onHref && (
        <div>
          <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 3 }}>קישור כפתור</label>
          <input value={href} onChange={e => onHref(e.target.value)} placeholder="להדביק לפה בבקשה את לינק הדף שתרצו שיעלה בעת לחיצה על הכפתור"
            style={{ width: '100%', border: '1px solid #ddd', borderRadius: 7, padding: '7px 10px', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const }} />
        </div>
      )}
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
    setSlides(s => [...s, { title: 'כותרת חדשה', titleColor: '#ffffff', sub: 'תת-כותרת', subColor: '#ffffff', btn: 'לחץ כאן', btnColor: '#111111', btnHref: '', badge: 'חדש', badgeColor: '#111111', img: '', overlay: 'rgba(30,30,30,0.45)' }])
    setActive(slides.length)
  }

  function removeSlide(i: number) {
    if (slides.length === 1) return
    setSlides(s => s.filter((_, idx) => idx !== i))
    setActive(Math.max(0, i - 1))
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    const fileName = `hero_${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('gallery').upload(fileName, file)
    if (!error) { const { data } = supabase.storage.from('gallery').getPublicUrl(fileName); update('img', data.publicUrl) }
    setUploading(false); if (fileRef.current) fileRef.current.value = ''
  }

  async function save() {
    await supabase.from('homepage_content').upsert({ key: 'hero', value: slides, updated_at: new Date().toISOString() })
    setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <div style={{ color: '#aaa', padding: 40, textAlign: 'center' }}>טוען...</div>

  const slide = slides[active]
  const overlayHex = rgbaToHex(slide.overlay)
  const overlayAlpha = rgbaToAlpha(slide.overlay)

  return (
    <div style={{ direction: 'rtl' }}>
      {/* TABS */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {slides.map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <button onClick={() => setActive(i)} style={{ padding: '5px 14px', borderRadius: 7, border: '1px solid #ddd', background: active === i ? '#F0C040' : '#fff', fontWeight: active === i ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>
              שקופית {i + 1}
            </button>
            {slides.length > 1 && (
              <button onClick={() => removeSlide(i)} style={{ background: '#fee', border: 'none', color: '#e33', borderRadius: 5, width: 20, height: 20, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            )}
          </div>
        ))}
        <button onClick={addSlide} style={{ padding: '5px 12px', borderRadius: 7, border: '1px dashed #ddd', background: '#fff', cursor: 'pointer', fontSize: 16, color: '#aaa' }}>+</button>
      </div>

      {/* FIELDS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Row label="כותרת" value={slide.title} color={slide.titleColor || '#fff'} onValue={v => update('title', v)} onColor={v => update('titleColor', v)} />
        <Row label="תת-כותרת" value={slide.sub} color={slide.subColor || '#fff'} onValue={v => update('sub', v)} onColor={v => update('subColor', v)} />
        <Row label="טקסט כפתור" value={slide.btn} color={slide.btnColor || '#111'} onValue={v => update('btn', v)} onColor={v => update('btnColor', v)} href={(slide as any).btnHref || ''} onHref={v => update('btnHref', v)} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, alignItems: "start" }}>
          <Row label="תגית" value={slide.badge} color={slide.badgeColor || "#111"} onValue={v => update("badge", v)} onColor={v => update("badgeColor", v)} />
          <div>
            <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 3 }}>תמונה</label>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input value={slide.img} onChange={e => update("img", e.target.value)} placeholder="קישור תמונה" style={{ flex: 1, border: "1px solid #ddd", borderRadius: 7, padding: "7px 10px", fontSize: 13, fontFamily: "inherit", outline: "none" }} />
              <span style={{ fontSize: 11, color: "#bbb" }}>או</span>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
              <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ background: "#F0C040", color: "#111", border: "none", borderRadius: 7, padding: "7px 12px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>{uploading ? "..." : "+ העלה"}</button>
            </div>
            {slide.img && <img src={slide.img} alt="preview" style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 6, marginTop: 6 }} />}
          </div>
        </div>
        </div>

        {/* OVERLAY */}
        <div style={{ background: '#f9f9f9', borderRadius: 8, padding: '10px 12px' }}>
          <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 8 }}>צבע כיסוי (overlay)</label>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input type="color" value={overlayHex} onChange={e => update('overlay', hexToRgba(e.target.value, overlayAlpha))}
              style={{ width: 40, height: 34, border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer', padding: 2, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#aaa', marginBottom: 3 }}>שקיפות: {Math.round(overlayAlpha * 100)}%</div>
              <input type="range" min={0} max={1} step={0.05} value={overlayAlpha}
                onChange={e => update('overlay', hexToRgba(overlayHex, parseFloat(e.target.value)))}
                style={{ width: '100%' }} />
            </div>
            <div style={{ width: 50, height: 34, borderRadius: 6, background: slide.overlay, border: '1px solid #ddd', flexShrink: 0 }} />
          </div>
        </div>
      </div>

      <button onClick={save} style={{ marginTop: 14, background: '#2D6A4F', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 24px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
        {saved ? '✓ נשמר!' : 'שמור שינויים'}
      </button>
    </div>
  )
}
