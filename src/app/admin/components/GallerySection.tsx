'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface GalleryImage { id: string; url: string; title: string; created_at: string }

export default function GallerySection() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function load() {
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false })
    if (data) setImages(data)
  }

  useEffect(() => { load() }, [])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setError('')
    try {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from('gallery').upload(fileName, file)
      if (upErr) throw upErr
      const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(fileName)
      const { error: dbErr } = await supabase.from('gallery').insert({ url: urlData.publicUrl, title: title || file.name })
      if (dbErr) throw dbErr
      setTitle(''); if (fileRef.current) fileRef.current.value = ''
      await load()
    } catch (err: any) { setError(err.message) }
    setUploading(false)
  }

  async function handleDelete(img: GalleryImage) {
    const fileName = img.url.split('/').pop()
    await supabase.storage.from('gallery').remove([fileName!])
    await supabase.from('gallery').delete().eq('id', img.id)
    await load()
  }

  return (
    <div style={{ padding: 24, direction: 'rtl' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, color: '#222' }}>גלריית תמונות</h2>
      <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 20, marginBottom: 28 }}>
        <div style={{ fontWeight: 600, marginBottom: 12, color: '#333' }}>העלאת תמונה חדשה</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <input type="text" placeholder="כותרת תמונה (אופציונלי)" value={title} onChange={e => setTitle(e.target.value)}
            style={{ border: '1px solid #ddd', borderRadius: 8, padding: '8px 14px', fontSize: 14, fontFamily: 'inherit', width: 220, outline: 'none' }} />
          <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            style={{ background: '#F0C040', color: '#111', border: 'none', borderRadius: 8, padding: '9px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
            {uploading ? 'מעלה...' : '+ בחר תמונה'}
          </button>
        </div>
        {error && <div style={{ color: 'red', fontSize: 13, marginTop: 8 }}>{error}</div>}
      </div>
      {images.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#aaa', padding: 60 }}>אין תמונות בגלריה עדיין</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {images.map(img => (
            <div key={img.id} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #eee', background: '#fff' }}>
              <img src={img.url} alt={img.title} style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 130 }}>{img.title}</span>
                <button onClick={() => handleDelete(img)}
                  style={{ background: '#fee', border: 'none', borderRadius: 6, color: '#e33', fontSize: 12, padding: '4px 10px', cursor: 'pointer', fontFamily: 'inherit' }}>מחק</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
