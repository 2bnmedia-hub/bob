'use client'

import { useState, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface ParsedRow {
  name: string
  price: number
  stock: number
  category: string
  sku?: string
  description?: string
  [key: string]: any
}

interface ImportResult {
  inserted: number
  updated: number
  errors: string[]
}

type Step = 'upload' | 'preview' | 'importing' | 'done'

// Field mapping — common column names → our fields
const FIELD_MAP: Record<string, keyof ParsedRow> = {
  'שם': 'name', 'שם מוצר': 'name', 'name': 'name', 'product': 'name',
  'מחיר': 'price', 'price': 'price', 'מחיר מכירה': 'price',
  'מלאי': 'stock', 'stock': 'stock', 'כמות': 'stock', 'qty': 'stock',
  'קטגוריה': 'category', 'category': 'category', 'cat': 'category',
  'מק"ט': 'sku', 'sku': 'sku', 'מקט': 'sku', 'barcode': 'sku',
  'תיאור': 'description', 'description': 'description',
}

export default function ImportModal({ onClose }: { onClose: () => void }) {
  const [step, setStep]         = useState<Step>('upload')
  const [drag, setDrag]         = useState(false)
  const [fileName, setFileName] = useState('')
  const [rows, setRows]         = useState<ParsedRow[]>([])
  const [errors, setErrors]     = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [result, setResult]     = useState<ImportResult | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // ── Parse CSV ──────────────────────────────────────
  function parseCSV(text: string): ParsedRow[] {
    const lines = text.trim().split('\n')
    if (lines.length < 2) throw new Error('הקובץ ריק')
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
    const mapped = headers.map(h => FIELD_MAP[h] ?? h)

    return lines.slice(1).map((line, i) => {
      const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
      const row: any = {}
      mapped.forEach((key, j) => { row[key] = vals[j] ?? '' })
      return normalizeRow(row, i + 2)
    }).filter(Boolean) as ParsedRow[]
  }

  // ── Parse JSON ─────────────────────────────────────
  function parseJSON(text: string): ParsedRow[] {
    const data = JSON.parse(text)
    const arr = Array.isArray(data) ? data : data.products ?? data.items ?? []
    return arr.map((item: any, i: number) => {
      const row: any = {}
      Object.entries(item).forEach(([k, v]) => {
        const mapped = FIELD_MAP[k] ?? k
        row[mapped] = v
      })
      return normalizeRow(row, i + 1)
    }).filter(Boolean)
  }

  function normalizeRow(row: any, lineNum: number): ParsedRow | null {
    if (!row.name) { errors.push(`שורה ${lineNum}: חסר שם מוצר`) ; return null }
    return {
      ...row,
      name:     String(row.name || '').trim(),
      price:    parseFloat(row.price) || 0,
      stock:    parseInt(row.stock)   || 0,
      category: String(row.category || '').trim(),
      sku:      row.sku ? String(row.sku).trim() : undefined,
    }
  }

  // ── Handle file ────────────────────────────────────
  const handleFile = useCallback(async (file: File) => {
    setFileName(file.name)
    setErrors([])
    const errs: string[] = []
    try {
      const ext = file.name.split('.').pop()?.toLowerCase()
      let parsed: ParsedRow[] = []

      if (ext === 'json') {
        const text = await file.text()
        parsed = parseJSON(text)
      } else if (ext === 'csv') {
        const text = await file.text()
        parsed = parseCSV(text)
      } else if (ext === 'xlsx' || ext === 'xls') {
        // XLSX parsing via sheetjs — loaded dynamically
        const XLSX = await import('xlsx')
        const buf  = await file.arrayBuffer()
        const wb   = XLSX.read(buf, { type: 'array' })
        const ws   = wb.Sheets[wb.SheetNames[0]]
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][]
        if (data.length < 2) throw new Error('גיליון ריק')
        const headers = (data[0] as string[]).map(h => String(h).trim())
        const mapped  = headers.map(h => FIELD_MAP[h] ?? h)
        parsed = data.slice(1).map((row, i) => {
          const obj: any = {}
          mapped.forEach((k, j) => { obj[k] = row[j] ?? '' })
          return normalizeRow(obj, i + 2)
        }).filter(Boolean) as ParsedRow[]
      } else {
        throw new Error('סוג קובץ לא נתמך')
      }

      if (errs.length) setErrors(errs)
      setRows(parsed)
      setStep('preview')
    } catch (e: any) {
      setErrors([e.message ?? 'שגיאה בקריאת הקובץ'])
    }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDrag(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  // ── Import to Supabase ─────────────────────────────
  async function startImport() {
    setStep('importing')
    setProgress(0)
    
    let inserted = 0, updated = 0
    const importErrors: string[] = []
    const BATCH = 50

    for (let i = 0; i < rows.length; i += BATCH) {
      const batch = rows.slice(i, i + BATCH).map(r => ({
        name:        r.name,
        price:       r.price,
        stock:       r.stock,
        category:    r.category,
        sku:         r.sku ?? null,
        description: r.description ?? null,
        slug:        slugify(r.name),
        updated_at:  new Date().toISOString(),
      }))

      const { error } = await supabase
        .from('products')
        .upsert(batch, { onConflict: 'slug', ignoreDuplicates: false })

      if (error) importErrors.push(error.message)
      else inserted += batch.length

      setProgress(Math.round(((i + BATCH) / rows.length) * 100))
    }

    setResult({ inserted, updated, errors: importErrors })
    setStep('done')
  }

  function slugify(str: string) {
    return str.trim().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\u0590-\u05FF-]/g, '')
  }

  return (
    <div className="import-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="import-modal">
        <div className="import-modal-header">
          <span className="import-modal-title">ייבוא קובץ מוצרים</span>
          <button className="btn-admin" style={{ padding: '4px 10px' }} onClick={onClose}>✕</button>
        </div>

        {/* UPLOAD */}
        {step === 'upload' && (
          <>
            <div className="import-step"><div className="import-step-num">1</div><span>בחר קובץ CSV, Excel (XLSX/XLS) או JSON</span></div>
            <div className="import-step"><div className="import-step-num">2</div><span>המערכת ממפה אוטומטית: שם, מחיר, מלאי, קטגוריה, מק"ט</span></div>
            <div className="import-step"><div className="import-step-num">3</div><span>תצוגה מקדימה לפני שמירה — שגיאות מסומנות</span></div>

            <div
              className={`file-drop-zone${drag ? ' drag' : ''}`}
              onDragOver={e => { e.preventDefault(); setDrag(true) }}
              onDragLeave={() => setDrag(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
            >
              <div className="drop-icon">⬆️</div>
              <div className="drop-title">גרור קובץ לכאן או לחץ לבחירה</div>
              <div className="drop-sub">עד 10,000 שורות</div>
              <div className="fmt-tags">
                <span className="fmt-tag">CSV</span>
                <span className="fmt-tag">XLSX</span>
                <span className="fmt-tag">XLS</span>
                <span className="fmt-tag">JSON</span>
              </div>
            </div>
            <input ref={inputRef} type="file" accept=".csv,.xlsx,.xls,.json"
              style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />

            {errors.length > 0 && (
              <div className="import-result import-error">❌ {errors[0]}</div>
            )}

            <div style={{ fontSize: 12, color: '#888', background: '#f5f5f5', borderRadius: 8, padding: '10px 12px' }}>
              <strong>כותרות נתמכות בקובץ:</strong><br/>
              שם / name / product &nbsp;·&nbsp; מחיר / price &nbsp;·&nbsp; מלאי / stock / כמות / qty<br/>
              קטגוריה / category &nbsp;·&nbsp; מק"ט / sku / barcode &nbsp;·&nbsp; תיאור / description
            </div>
          </>
        )}

        {/* PREVIEW */}
        {step === 'preview' && (
          <>
            <div className="import-result">
              ✅ <strong>{rows.length} שורות נמצאו</strong> בקובץ {fileName}
              {errors.length > 0 && <span style={{ color: '#A32D2D', marginRight: 8 }}>⚠ {errors.length} שגיאות</span>}
            </div>
            <div className="preview-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>שם</th><th>קטגוריה</th><th>מחיר</th><th>מלאי</th><th>מק"ט</th></tr>
                </thead>
                <tbody>
                  {rows.slice(0, 8).map((r, i) => (
                    <tr key={i}>
                      <td className="td-bold">{r.name}</td>
                      <td>{r.category}</td>
                      <td>₪{r.price}</td>
                      <td>{r.stock}</td>
                      <td className="td-mono">{r.sku ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length > 8 && (
                <div style={{ padding: '8px 12px', fontSize: 11, color: '#888', borderTop: '1px solid #eee' }}>
                  ועוד {rows.length - 8} שורות...
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn-admin" onClick={() => setStep('upload')}>← חזרה</button>
              <button className="btn-admin primary" onClick={startImport}>
                ייבא {rows.length} מוצרים לבסיס הנתונים
              </button>
            </div>
          </>
        )}

        {/* IMPORTING */}
        {step === 'importing' && (
          <>
            <div style={{ textAlign: 'center', padding: '20px 0', fontSize: 14, color: '#555' }}>
              מייבא מוצרים... {progress}%
            </div>
            <div className="import-progress-bar">
              <div className="import-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div style={{ fontSize: 12, color: '#888', textAlign: 'center' }}>
              שולח ל-Supabase בחבילות של 50
            </div>
          </>
        )}

        {/* DONE */}
        {step === 'done' && result && (
          <>
            <div className="import-result">
              ✅ <strong>{result.inserted} מוצרים יובאו בהצלחה</strong>
            </div>
            {result.errors.length > 0 && (
              <div className="import-result import-error">
                ❌ {result.errors.length} שגיאות: {result.errors[0]}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
              <button className="btn-admin" onClick={() => { setStep('upload'); setRows([]); setErrors([]) }}>
                ייבוא נוסף
              </button>
              <button className="btn-admin primary" onClick={onClose}>סגור</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
