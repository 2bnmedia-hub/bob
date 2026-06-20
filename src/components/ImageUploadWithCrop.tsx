'use client'
import { useState, useCallback, useRef } from 'react'
import Cropper from 'react-easy-crop'
import { supabase } from '@/lib/supabase'

interface Props {
  value: string
  onChange: (url: string) => void
  aspect?: number
}

async function getCroppedImg(imageSrc: string, croppedAreaPixels: any): Promise<Blob> {
  const image = new Image()
  image.src = imageSrc
  await new Promise(r => { image.onload = r })
  const canvas = document.createElement('canvas')
  canvas.width = croppedAreaPixels.width
  canvas.height = croppedAreaPixels.height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(image, croppedAreaPixels.x, croppedAreaPixels.y, croppedAreaPixels.width, croppedAreaPixels.height, 0, 0, croppedAreaPixels.width, croppedAreaPixels.height)
  return new Promise(r => canvas.toBlob(b => r(b!), 'image/jpeg', 0.92))
}

export default function ImageUploadWithCrop({ value, onChange, aspect = 16/9 }: Props) {
  const [src, setSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedArea, setCroppedArea] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setSrc(reader.result as string)
    reader.readAsDataURL(file)
    if (fileRef.current) fileRef.current.value = ''
  }

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedArea(croppedAreaPixels)
  }, [])

  async function handleUpload() {
    if (!src || !croppedArea) return
    setUploading(true)
    try {
      const blob = await getCroppedImg(src, croppedArea)
      const fileName = `img_${Date.now()}.jpg`
      const { error } = await supabase.storage.from('gallery').upload(fileName, blob, { contentType: 'image/jpeg' })
      if (!error) {
        const { data } = supabase.storage.from('gallery').getPublicUrl(fileName)
        onChange(data.publicUrl)
        setSrc(null)
      }
    } catch (err) { console.error(err) }
    setUploading(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input value={value} onChange={e => onChange(e.target.value)} placeholder="הכנס קישור תמונה"
          style={{ flex: 1, border: '1px solid #ddd', borderRadius: 6, padding: '7px 10px', fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
        <span style={{ fontSize: 12, color: '#aaa' }}>או</span>
        <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} style={{ display: 'none' }} />
        <button onClick={() => fileRef.current?.click()}
          style={{ background: '#F0C040', color: '#111', border: 'none', borderRadius: 6, padding: '7px 14px', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
          + העלה
        </button>
      </div>

      {value && !src && <img src={value} alt="preview" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8, marginTop: 8 }} />}

      {src && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <div style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>גזור את התמונה</div>
          <div style={{ position: 'relative', width: '80vw', height: '50vh', background: '#222', borderRadius: 12, overflow: 'hidden' }}>
            <Cropper image={src} crop={crop} zoom={zoom} aspect={aspect} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#fff', fontSize: 13 }}>
            <span>זום:</span>
            <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={e => setZoom(Number(e.target.value))} style={{ width: 200 }} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setSrc(null)} style={{ background: '#555', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>ביטול</button>
            <button onClick={handleUpload} disabled={uploading} style={{ background: '#F0C040', color: '#111', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              {uploading ? 'מעלה...' : 'אישור והעלאה'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
