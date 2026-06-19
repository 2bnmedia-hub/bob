# פרויקט: חנות אינטרנטית "בוב חומרי בניין" — סטטוס עדכני v3

## מיקום הפרויקט
`~/Desktop/2bn-tech/bob` (משתמש: `was`)

## URLs
- **Production (Vercel)**: https://bob-alpha.vercel.app
- **GitHub**: https://github.com/2bnmedia-hub/bob
- **Local dev**: http://localhost:3000

## טכנולוגיה
- Next.js 16.2.9 + TypeScript
- פונט: Open Sans — נטען דרך Google Fonts
- Lucide React — אייקונים מודרניים
- `next.config.mjs` (לא `.ts` — SWC לא תומך ב-.ts על darwin/arm64)
- Supabase לבסיס נתונים
- Vercel לדיפלוי — מחובר ל-GitHub (auto-deploy בכל push)

## Supabase
- URL: `https://qaneanzpipjtnlonqmyd.supabase.co`
- Anon key: שמור ב-`.env.local` ובמשתני Vercel
- טבלאות: `categories`, `products`, `orders`, `order_items`

## צבעי מותג
- זהב: `#F0C040` (`--gold`)
- חום: `#6B4423` (`--brown`) — בחלקים
- ירוק: `#2D6A4F` (`--red`) — הוחלף מאדום
- רקע: `#FFFFFF` / `#F5F5F5`
- אפור כהה פוטר: `#F5F5F5`

## הרצת dev server
```bash
cd ~/Desktop/2bn-tech/bob
npm run dev
```
פותח על פורט 3000 (או 3001 אם תפוס)

## דיפלוי
```bash
git add .
git commit -m "תיאור"
git push
```
Vercel עושה deploy אוטומטי מ-GitHub.

## מבנה הפרויקט
```
src/
  app/
    page.tsx              ← דף הבית המלא
    layout.tsx            ← RTL, Open Sans, CartProvider + Header
    globals.css           ← צבעי מותג, base styles, RTL
    about/page.tsx        ← דף אודות
    contact/page.tsx      ← דף צור קשר (עם טופס)
    faq/page.tsx          ← שאלות נפוצות (accordion)
    terms/page.tsx        ← תנאי שימוש
    privacy/page.tsx      ← מדיניות פרטיות
    accessibility/page.tsx← הצהרת נגישות
    account/page.tsx      ← כניסה/הרשמה
    cart/page.tsx         ← סל קניות מלא
    sales/page.tsx        ← דף מבצעים (מ-Supabase)
    categories/page.tsx   ← כל הקטגוריות (מ-Supabase)
    services/page.tsx     ← שירותים
    tips/page.tsx         ← פרויקטים וטיפים
    category/[slug]/page.tsx ← דף קטגוריה דינמי
    product/[slug]/page.tsx  ← דף מוצר דינמי
  components/
    Header.tsx            ← Navbar (3 שכבות + pills קטגוריות)
  context/
    CartContext.tsx        ← state גלובלי לסל
  lib/
    supabase.ts           ← Supabase client
```

## דף הבית — סקשנים
1. **Hero Slider** — 3 שקופיות עם Ken Burns + חצים + dots
2. **Trust Bar** — משלוח/תשלום/החזרה/שירות
3. **מבצעים מיוחדים** — בנר אדום + 4 כרטיסי מוצר
4. **Full Promo Banner** — בנר ירוק רחב
5. **Top Deals** — 3 כרטיסי חיסכון + בנר
6. **קנייה לפי קטגוריה** — בנטו גריד עם תמונות
7. **קטגוריות מובילות** — tabs + 6 מוצרים
8. **מדריכים וטיפים** — editorial tabs
9. **מותגים** — גריד עם לוגואים (Clearbit API)
10. **Footer** — 4 עמודות + newsletter + social

## Header — מבנה
- **Top Bar**: כתובת + שעות + לינקים
- **Main Header**: לוגו (עם אנימציית float+shine) + ניווט + חיפוש + סל
- **Pills Bar**: 10 קטגוריות עם אייקוני Lucide, רוחב מלא

## Supabase — טבלאות
```sql
categories: id, name, slug, description, image_url, parent_id, sort_order, active
products:   id, name, slug, description, price, price_was, category_id, images[], 
            stock, sku, brand, active, featured, on_sale, attributes
orders:     id, customer_name, email, phone, address, status, total, shipping
order_items: id, order_id, product_id, product_name, product_price, quantity, subtotal
```

## קטגוריות קיימות ב-DB
- חשמל (`electric`)
- מכשירי חשמל (`appliances`)
- חומרי איטום (`sealing`)
- שכפול מפתחות (`keys`)
- אינסטלציה (`plumbing`)
- גז (`gas`)
- קידוד שלטים (`remotes`)
- כיתיים (`locks`)

## מה עוד לא קיים
1. תשלום אמיתי (Stripe/PayPlus)
2. אזור אישי למשתמש (הזמנות, פרטים)
3. Authentication אמיתי (Supabase Auth)
4. חיפוש פונקציונלי
5. סנכרון Hyp (בהמתנה לתיעוד API)
6. דף checkout
7. ניהול מלאי בזמן אמת

## כללי עבודה
1. קצר וממוקד
2. עבודה מקומית → git push → Vercel auto-deploy
3. אין אימוג׳ים — רק Lucide icons
4. RTL בכל מקום
5. צבעים: זהב/ירוק/אפור — לא חום כהה
6. עיצוב מינימליסטי מודרני 2026

## קרדיט
עיצוב ובנייה: [2bnmedia.com](https://2bnmedia.com)
