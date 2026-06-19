'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  const shipping = total >= 400 ? 0 : 39;
  const finalTotal = total + shipping;

  if (items.length === 0) {
    return (
      <main style={{ direction: 'rtl', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '64px var(--px)' }}>
        <div style={{ background: 'var(--cream)', borderRadius: '50%', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShoppingCart size={44} strokeWidth={1.5} color="var(--brown)" />
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#111' }}>הסל שלך ריק</h1>
        <p style={{ color: 'var(--gray-400)', fontSize: 16 }}>הוסף מוצרים כדי להתחיל</p>
        <Link href="/" className="btn-secondary" style={{ marginTop: 8 }}>חזור לקנייה</Link>
      </main>
    );
  }

  return (
    <main style={{ direction: 'rtl', padding: '40px 0', background: 'var(--gray-50)', minHeight: '70vh' }}>
      <div className="container">

        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <Link href="/" style={{ color: 'var(--gray-400)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
            <ArrowRight size={14} /> דף הבית
          </Link>
          <span style={{ color: 'var(--gray-300)' }}>/</span>
          <span style={{ fontSize: 13, color: 'var(--gray-800)', fontWeight: 600 }}>סל קניות</span>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#111', marginBottom: 24 }}>
          סל הקניות שלי
          <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--gray-400)', marginRight: 12 }}>
            {items.reduce((s, i) => s + i.quantity, 0)} פריטים
          </span>
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>

          {/* ITEMS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map(item => (
              <div key={item.id} style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 16, padding: 20, display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: 20, alignItems: 'center' }}>
                <div style={{ background: 'var(--gray-100)', borderRadius: 10, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
<ShoppingCart size={28} strokeWidth={1.5} color="var(--gray-400)" />
                </div>

                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--gray-800)', marginBottom: 6 }}>{item.name}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#222' }}>₪{item.price.toFixed(2)}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{ width: 32, height: 32, border: '1.5px solid var(--gray-200)', borderRadius: 8, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                      <Minus size={14} />
                    </button>
                    <span style={{ fontWeight: 700, fontSize: 15, minWidth: 28, textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{ width: 32, height: 32, border: '1.5px solid var(--gray-200)', borderRadius: 8, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                      <Plus size={14} />
                    </button>
                    <span style={{ color: 'var(--gray-400)', fontSize: 13, marginRight: 8 }}>
                      סה״כ: <strong style={{ color: 'var(--gray-800)' }}>₪{(item.price * item.quantity).toFixed(2)}</strong>
                    </span>
                  </div>
                </div>

                <button onClick={() => removeItem(item.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: 'var(--gray-400)', transition: 'color 0.15s', borderRadius: 8 }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-400)')}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            <button onClick={clearCart}
              style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--gray-400)', fontSize: 13, cursor: 'pointer', textDecoration: 'underline', padding: '4px 0', fontFamily: 'var(--font)' }}>
              נקה סל
            </button>
          </div>

          {/* SUMMARY */}
          <div style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 20, padding: 28, position: 'sticky', top: 140 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 24 }}>סיכום הזמנה</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--gray-600)' }}>
                <span>סכום ביניים</span>
                <span>₪{total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--gray-600)' }}>
                <span>משלוח</span>
                <span style={{ color: shipping === 0 ? '#2D6A4F' : 'inherit', fontWeight: shipping === 0 ? 700 : 400 }}>
                  {shipping === 0 ? 'חינם' : `₪${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <div style={{ background: '#f0faf5', border: '1px solid #b7e4cc', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#2D6A4F', fontWeight: 600 }}>
                  הוסף עוד ₪{(400 - total).toFixed(2)} לקבלת משלוח חינם
                </div>
              )}
              <div style={{ height: 1, background: 'var(--gray-200)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, fontWeight: 900, color: '#111' }}>
                <span>סה״כ</span>
                <span>₪{finalTotal.toFixed(2)}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--gray-400)', textAlign: 'center' }}>כולל מע״מ</div>
            </div>

            {/* COUPON */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-600)', marginBottom: 8 }}>קוד קופון</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="text" placeholder="הכנס קוד..."
                  style={{ flex: 1, border: '1.5px solid var(--gray-200)', borderRadius: 8, padding: '9px 12px', fontSize: 13, fontFamily: 'var(--font)', direction: 'rtl', outline: 'none' }} />
                <button className="btn-secondary" style={{ fontSize: 13, padding: '9px 16px' }}>החל</button>
              </div>
            </div>

            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 16, padding: '14px 0', borderRadius: 12 }}>
              לתשלום
            </button>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 16 }}>
              <span style={{ fontSize: 12, color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: 4 }}>תשלום מאובטח</span>
              <span style={{ fontSize: 12, color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: 4 }}>החזרה 30 יום</span>
            </div>

            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Link href="/" style={{ fontSize: 13, color: '#222', textDecoration: 'underline' }}>המשך בקנייה</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
