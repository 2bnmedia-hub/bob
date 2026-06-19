"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { parseFile, downloadProductTemplate, downloadCategoryTemplate, exportProducts, exportCategories } from "@/lib/importExport";

type Category = { id: string; name: string; slug: string; image_url: string | null };
type Product = { id: string; name: string; slug: string; price: number; old_price: number | null; stock: number; category_id: string | null; image_url: string | null; sku?: string | null; description?: string | null };
type Order = { id: string; customer_name: string; total: number; status: string; created_at: string };

const NAV = [
  { id: "overview", label: "סקירה כללית", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { id: "products", label: "מוצרים ומלאי", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m8 4v10M4 7v10l8 4" },
  { id: "categories", label: "קטגוריות", icon: "M4 6h16M4 12h16M4 18h7" },
] as const;

function KpiCard({ label, value, accent, icon }: { label: string; value: string; accent: string; icon: string }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full" style={{ background: accent + "1A" }}>
        <svg className="h-5 w-5" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d={icon} /></svg>
      </div>
      <p className="text-[14px] text-[var(--color-muted)]">{label}</p>
      <p className="mt-1 text-3xl font-black text-[var(--color-ink)]">{value}</p>
    </div>
  );
}

function ImportExportBar({ kind, onImported }: { kind: "products" | "categories"; onImported: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setMsg(null);
    try {
      const rows = await parseFile(file);
      if (kind === "categories") {
        const payload = rows.map((r) => ({
          name: String(r.name || "").trim(),
          slug: String(r.name || "").trim().replace(/\s+/g, "-"),
          image_url: r.image_url || null,
        })).filter((r) => r.name);
        const { error } = await supabase.from("categories").upsert(payload, { onConflict: "slug" });
        if (error) throw error;
        setMsg(`יובאו ${payload.length} קטגוריות בהצלחה.`);
      } else {
        const { data: cats } = await supabase.from("categories").select("id, name");
        const catMap = new Map((cats || []).map((c) => [c.name, c.id]));
        const payload = rows.map((r) => ({
          name: String(r.name || "").trim(),
          slug: String(r.name || "").trim().replace(/\s+/g, "-"),
          price: Number(r.price) || 0,
          old_price: r.old_price ? Number(r.old_price) : null,
          stock: r.stock ? Number(r.stock) : 0,
          sku: r.sku || null,
          category_id: r.category_name ? catMap.get(String(r.category_name).trim()) || null : null,
          image_url: r.image_url || null,
          description: r.description || null,
        })).filter((r) => r.name);
        const { error } = await supabase.from("products").upsert(payload, { onConflict: "slug" });
        if (error) throw error;
        setMsg(`יובאו ${payload.length} מוצרים בהצלחה.`);
      }
      onImported();
    } catch (err: any) {
      setMsg("שגיאה בייבוא: " + (err?.message || "לא ידוע"));
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-paper)] p-4">
      <span className="text-[14px] font-semibold text-[var(--color-ink)]">ייבוא מקובץ:</span>
      <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls,.json" onChange={handleFile} disabled={busy} className="text-[13px]" />
      <span className="mx-2 text-[var(--color-line)]">|</span>
      <span className="text-[14px] font-semibold text-[var(--color-ink)]">תבנית להורדה:</span>
      <button onClick={() => (kind === "products" ? downloadProductTemplate("csv") : downloadCategoryTemplate("csv"))} className="rounded-full border border-[var(--color-line)] px-3 py-1 text-[13px]">CSV</button>
      <button onClick={() => (kind === "products" ? downloadProductTemplate("xlsx") : downloadCategoryTemplate("xlsx"))} className="rounded-full border border-[var(--color-line)] px-3 py-1 text-[13px]">Excel</button>
      <button onClick={() => (kind === "products" ? downloadProductTemplate("json") : downloadCategoryTemplate("json"))} className="rounded-full border border-[var(--color-line)] px-3 py-1 text-[13px]">JSON</button>
      {busy ? <span className="text-[13px] text-[var(--color-muted)]">מעבד...</span> : null}
      {msg ? <span className="text-[13px] text-[var(--color-brown)]">{msg}</span> : null}
    </div>
  );
}

export default function DashboardPage() {
  const [tab, setTab] = useState<"overview" | "products" | "categories">("overview");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingCat, setEditingCat] = useState<Partial<Category> | null>(null);
  const [editingProd, setEditingProd] = useState<Partial<Product> | null>(null);

  async function loadAll() {
    setLoading(true);
    const [{ data: cats }, { data: prods }, { data: ords }] = await Promise.all([
      supabase.from("categories").select("*").order("name"),
      supabase.from("products").select("*").order("name"),
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
    ]);
    setCategories(cats || []);
    setProducts(prods || []);
    setOrders(ords || []);
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, []);

  async function saveCategory() {
    if (!editingCat?.name) return;
    const slug = editingCat.slug || editingCat.name.trim().replace(/\s+/g, "-");
    if (editingCat.id) {
      await supabase.from("categories").update({ name: editingCat.name, slug, image_url: editingCat.image_url || null }).eq("id", editingCat.id);
    } else {
      await supabase.from("categories").insert({ name: editingCat.name, slug, image_url: editingCat.image_url || null });
    }
    setEditingCat(null);
    loadAll();
  }

  async function deleteCategory(id: string) {
    if (!confirm("למחוק קטגוריה זו?")) return;
    await supabase.from("categories").delete().eq("id", id);
    loadAll();
  }

  async function saveProduct() {
    if (!editingProd?.name || !editingProd?.price) return;
    const slug = editingProd.slug || editingProd.name.trim().replace(/\s+/g, "-");
    const payload = {
      name: editingProd.name,
      slug,
      price: editingProd.price,
      old_price: editingProd.old_price || null,
      stock: editingProd.stock || 0,
      sku: editingProd.sku || null,
      description: editingProd.description || null,
      category_id: editingProd.category_id || null,
      image_url: editingProd.image_url || null,
    };
    if (editingProd.id) {
      await supabase.from("products").update(payload).eq("id", editingProd.id);
    } else {
      await supabase.from("products").insert(payload);
    }
    setEditingProd(null);
    loadAll();
  }

  async function deleteProduct(id: string) {
    if (!confirm("למחוק מוצר זה?")) return;
    await supabase.from("products").delete().eq("id", id);
    loadAll();
  }

  const revenue = orders.filter((o) => o.status === "completed").reduce((s, o) => s + Number(o.total), 0);
  const lowStock = products.filter((p) => p.stock <= 5);
  const last7 = orders.filter((o) => new Date(o.created_at) > new Date(Date.now() - 7 * 86400000));

  return (
    <div className="flex min-h-screen bg-[var(--color-surface)]" dir="rtl">
      <aside className="flex w-64 shrink-0 flex-col border-l border-[var(--color-line)] bg-[var(--color-ink)] p-5">
        <div className="mb-8 flex items-center gap-2">
          <img src="/logo.png" alt="בוב" className="h-9 w-auto" />
          <span className="text-[15px] font-bold text-white">לוח בקרה</span>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map(function (n) {
            return (
              <button key={n.id} onClick={() => setTab(n.id)} className={"flex items-center gap-3 rounded-[var(--radius-sm)] px-3.5 py-2.5 text-[15px] font-medium transition " + (tab === n.id ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white")}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d={n.icon} /></svg>
                {n.label}
              </button>
            );
          })}
        </nav>
        <a href="/" className="mt-auto flex items-center gap-2 rounded-[var(--radius-sm)] px-3.5 py-2.5 text-[15px] font-medium text-white/60 transition hover:bg-white/5 hover:text-white">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          חזרה לחנות
        </a>
      </aside>

      <main className="flex-1 px-8 py-8">
        {loading ? <p className="text-[var(--color-muted)]">טוען...</p> : null}

        {tab === "overview" && !loading ? (
          <div>
            <h2 className="mb-6 text-2xl font-black text-[var(--color-ink)]">סקירה כללית</h2>
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              <KpiCard label="הכנסות (הזמנות שהושלמו)" value={"₪" + revenue.toLocaleString()} accent="#1c6e5c" icon="M12 8c-1.66 0-3 .9-3 2s1.34 2 3 2 3 .9 3 2-1.34 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 10v2" />
              <KpiCard label="הזמנות (7 ימים)" value={String(last7.length)} accent="#c8782e" icon="M3 3h18v4H3V3zm2 4h14l-1.5 13h-11L5 7zm5 4h4" />
              <KpiCard label="מוצרים בקטלוג" value={String(products.length)} accent="#50311a" icon="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m8 4v10M4 7v10l8 4" />
              <KpiCard label="מלאי נמוך" value={String(lowStock.length)} accent="#dc2626" icon="M12 9v4m0 4h.01M10.29 3.86l-8.18 14.18A1 1 0 003 19h18a1 1 0 00.89-1.96L13.71 3.86a1 1 0 00-1.42 0z" />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
                <h3 className="mb-4 text-[17px] font-bold text-[var(--color-ink)]">הזמנות אחרונות</h3>
                {orders.slice(0, 6).map(function (o) {
                  return (
                    <div key={o.id} className="flex items-center justify-between border-b border-[var(--color-line)] py-2.5 last:border-b-0">
                      <div>
                        <p className="text-[15px] font-medium text-[var(--color-ink)]">{o.customer_name}</p>
                        <p className="text-[13px] text-[var(--color-muted)]">{new Date(o.created_at).toLocaleDateString("he-IL")}</p>
                      </div>
                      <div className="text-end">
                        <p className="font-bold text-[var(--color-ink)]">₪{o.total}</p>
                        <span className={"text-[12px] " + (o.status === "completed" ? "text-green-600" : "text-amber-600")}>{o.status === "completed" ? "הושלמה" : "בטיפול"}</span>
                      </div>
                    </div>
                  );
                })}
                {orders.length === 0 ? <p className="text-[var(--color-muted)]">אין הזמנות עדיין.</p> : null}
              </div>

              <div className="rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
                <h3 className="mb-4 text-[17px] font-bold text-[var(--color-ink)]">התראות מלאי נמוך</h3>
                {lowStock.length === 0 ? <p className="text-[var(--color-muted)]">המלאי במצב תקין.</p> : null}
                {lowStock.map(function (p) {
                  return (
                    <div key={p.id} className="flex items-center justify-between border-b border-[var(--color-line)] py-2.5 last:border-b-0">
                      <p className="text-[15px] font-medium text-[var(--color-ink)]">{p.name}</p>
                      <span className="rounded-full bg-red-50 px-3 py-1 text-[13px] font-medium text-red-600">{p.stock} יח'</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        {tab === "categories" && !loading ? (
          <div>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-black text-[var(--color-ink)]">קטגוריות</h2>
              <div className="flex gap-2">
                <button onClick={() => exportCategories(categories.map((c) => ({ name: c.name, image_url: c.image_url || "" })), "csv")} className="rounded-full border border-[var(--color-line)] px-4 py-2 text-[14px]">ייצוא CSV</button>
                <button onClick={() => setEditingCat({})} className="rounded-full bg-[var(--color-brown)] px-5 py-2.5 text-[15px] font-semibold text-white">+ קטגוריה חדשה</button>
              </div>
            </div>

            <ImportExportBar kind="categories" onImported={loadAll} />

            <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-paper)]">
              {categories.map(function (c) {
                return (
                  <div key={c.id} className="flex items-center justify-between border-b border-[var(--color-line)] px-5 py-3.5 last:border-b-0">
                    <div className="flex items-center gap-3">
                      {c.image_url ? <img src={c.image_url} alt={c.name} className="h-10 w-10 rounded-[var(--radius-sm)] object-cover" /> : null}
                      <div>
                        <p className="font-semibold text-[var(--color-ink)]">{c.name}</p>
                        <p className="text-[14px] text-[var(--color-muted)]">{c.slug}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingCat(c)} className="rounded-full border border-[var(--color-line)] px-4 py-1.5 text-[14px]">עריכה</button>
                      <button onClick={() => deleteCategory(c.id)} className="rounded-full border border-red-300 px-4 py-1.5 text-[14px] text-red-600">מחיקה</button>
                    </div>
                  </div>
                );
              })}
              {categories.length === 0 ? <p className="p-5 text-[var(--color-muted)]">אין קטגוריות עדיין.</p> : null}
            </div>
          </div>
        ) : null}

        {tab === "products" && !loading ? (
          <div>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-black text-[var(--color-ink)]">מוצרים ומלאי</h2>
              <div className="flex gap-2">
                <button onClick={() => exportProducts(products.map((p) => ({ name: p.name, price: p.price, old_price: p.old_price || undefined, stock: p.stock, sku: p.sku || "", category_name: categories.find((c) => c.id === p.category_id)?.name || "", image_url: p.image_url || "", description: p.description || "" })), "csv")} className="rounded-full border border-[var(--color-line)] px-4 py-2 text-[14px]">ייצוא CSV</button>
                <button onClick={() => setEditingProd({})} className="rounded-full bg-[var(--color-brown)] px-5 py-2.5 text-[15px] font-semibold text-white">+ מוצר חדש</button>
              </div>
            </div>

            <ImportExportBar kind="products" onImported={loadAll} />

            <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-paper)]">
              {products.map(function (p) {
                return (
                  <div key={p.id} className="flex items-center justify-between border-b border-[var(--color-line)] px-5 py-3.5 last:border-b-0">
                    <div className="flex items-center gap-3">
                      {p.image_url ? <img src={p.image_url} alt={p.name} className="h-10 w-10 rounded-[var(--radius-sm)] object-cover" /> : null}
                      <div>
                        <p className="font-semibold text-[var(--color-ink)]">{p.name}</p>
                        <p className="text-[14px] text-[var(--color-muted)]">₪{p.price} · מלאי: <span className={p.stock <= 5 ? "font-bold text-red-600" : ""}>{p.stock}</span></p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingProd(p)} className="rounded-full border border-[var(--color-line)] px-4 py-1.5 text-[14px]">עריכה</button>
                      <button onClick={() => deleteProduct(p.id)} className="rounded-full border border-red-300 px-4 py-1.5 text-[14px] text-red-600">מחיקה</button>
                    </div>
                  </div>
                );
              })}
              {products.length === 0 ? <p className="p-5 text-[var(--color-muted)]">אין מוצרים עדיין.</p> : null}
            </div>
          </div>
        ) : null}
      </main>

      {editingCat ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-[var(--radius-md)] bg-[var(--color-paper)] p-6">
            <h2 className="mb-4 text-xl font-bold text-[var(--color-ink)]">{editingCat.id ? "עריכת קטגוריה" : "קטגוריה חדשה"}</h2>
            <label className="mb-1 block text-[14px] font-medium">שם</label>
            <input value={editingCat.name || ""} onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })} className="mb-3 w-full rounded-[var(--radius-sm)] border border-[var(--color-line)] px-3 py-2.5" />
            <label className="mb-1 block text-[14px] font-medium">קישור לתמונה (אופציונלי)</label>
            <input value={editingCat.image_url || ""} onChange={(e) => setEditingCat({ ...editingCat, image_url: e.target.value })} className="mb-5 w-full rounded-[var(--radius-sm)] border border-[var(--color-line)] px-3 py-2.5" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingCat(null)} className="rounded-full border border-[var(--color-line)] px-5 py-2">ביטול</button>
              <button onClick={saveCategory} className="rounded-full bg-[var(--color-ink)] px-5 py-2 text-white">שמירה</button>
            </div>
          </div>
        </div>
      ) : null}

      {editingProd ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[var(--radius-md)] bg-[var(--color-paper)] p-6">
            <h2 className="mb-4 text-xl font-bold text-[var(--color-ink)]">{editingProd.id ? "עריכת מוצר" : "מוצר חדש"}</h2>
            <label className="mb-1 block text-[14px] font-medium">שם</label>
            <input value={editingProd.name || ""} onChange={(e) => setEditingProd({ ...editingProd, name: e.target.value })} className="mb-3 w-full rounded-[var(--radius-sm)] border border-[var(--color-line)] px-3 py-2.5" />
            <label className="mb-1 block text-[14px] font-medium">מק"ט</label>
            <input value={editingProd.sku || ""} onChange={(e) => setEditingProd({ ...editingProd, sku: e.target.value })} className="mb-3 w-full rounded-[var(--radius-sm)] border border-[var(--color-line)] px-3 py-2.5" />
            <label className="mb-1 block text-[14px] font-medium">מחיר (₪)</label>
            <input type="number" value={editingProd.price ?? ""} onChange={(e) => setEditingProd({ ...editingProd, price: Number(e.target.value) })} className="mb-3 w-full rounded-[var(--radius-sm)] border border-[var(--color-line)] px-3 py-2.5" />
            <label className="mb-1 block text-[14px] font-medium">מחיר קודם (אופציונלי)</label>
            <input type="number" value={editingProd.old_price ?? ""} onChange={(e) => setEditingProd({ ...editingProd, old_price: Number(e.target.value) })} className="mb-3 w-full rounded-[var(--radius-sm)] border border-[var(--color-line)] px-3 py-2.5" />
            <label className="mb-1 block text-[14px] font-medium">מלאי</label>
            <input type="number" value={editingProd.stock ?? ""} onChange={(e) => setEditingProd({ ...editingProd, stock: Number(e.target.value) })} className="mb-3 w-full rounded-[var(--radius-sm)] border border-[var(--color-line)] px-3 py-2.5" />
            <label className="mb-1 block text-[14px] font-medium">קטגוריה</label>
            <select value={editingProd.category_id || ""} onChange={(e) => setEditingProd({ ...editingProd, category_id: e.target.value })} className="mb-3 w-full rounded-[var(--radius-sm)] border border-[var(--color-line)] px-3 py-2.5">
              <option value="">ללא</option>
              {categories.map(function (c) { return (<option key={c.id} value={c.id}>{c.name}</option>); })}
            </select>
            <label className="mb-1 block text-[14px] font-medium">קישור לתמונה</label>
            <input value={editingProd.image_url || ""} onChange={(e) => setEditingProd({ ...editingProd, image_url: e.target.value })} className="mb-3 w-full rounded-[var(--radius-sm)] border border-[var(--color-line)] px-3 py-2.5" />
            <label className="mb-1 block text-[14px] font-medium">תיאור</label>
            <textarea value={editingProd.description || ""} onChange={(e) => setEditingProd({ ...editingProd, description: e.target.value })} rows={3} className="mb-5 w-full rounded-[var(--radius-sm)] border border-[var(--color-line)] px-3 py-2.5" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingProd(null)} className="rounded-full border border-[var(--color-line)] px-5 py-2">ביטול</button>
              <button onClick={saveProduct} className="rounded-full bg-[var(--color-ink)] px-5 py-2 text-white">שמירה</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
