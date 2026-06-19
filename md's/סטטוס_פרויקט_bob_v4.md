# פרויקט: בוב חומרי בניין — סטטוס v4

## מיקום הפרויקט
`~/Desktop/2bn-tech/bob` (משתמש: `was`)

## URLs
- **Production (Vercel)**: https://bob-alpha.vercel.app
- **GitHub**: https://github.com/2bnmedia-hub/bob
- **Local dev**: http://localhost:3000

## טכנולוגיה
- Next.js + TypeScript
- פונט: Open Sans — נטען דרך Google Fonts
- Lucide React — אייקונים
- `next.config.mjs`
- Supabase לבסיס נתונים
- Vercel לדיפלוי — auto-deploy בכל push

## Supabase
- URL: `https://qaneanzpipjtnlonqmyd.supabase.co`
- Anon key: שמור ב-`.env.local` ובמשתני Vercel
- טבלאות: `categories`, `products`, `orders`, `order_items`

## Groq API (צ'אט בוט)
- Key שמור ב-`.env.local` כ-`GROQ_API_KEY`
- מודל: `llama-3.3-70b-versatile`
- API route: `src/app/api/chat/route.ts`

## צבעי מותג
- זהב: `#F0C040` / `#FCD34D` (`--gold`)
- ירוק: `#2D6A4F` (`--red`)
- רקע: `#FFFFFF` / `#F5F5F5`

## מבנה הפרויקט
src/
  app/
    page.tsx              ← דף הבית המלא
    layout.tsx            ← RTL, Open Sans, CartProvider + Header + ChatWidget
    globals.css           ← צבעי מותג, base styles, RTL, trust-item shimmer
    about/page.tsx
    contact/page.tsx
    faq/page.tsx
    terms/page.tsx
    privacy/page.tsx
    accessibility/page.tsx
    account/page.tsx
    cart/page.tsx
    sales/page.tsx
    categories/page.tsx
    services/page.tsx     ← Lucide icons (Key, Radio, HardHat, Scissors, Truck, Wrench)
    tips/page.tsx
    category/[slug]/page.tsx
    product/[slug]/page.tsx
    api/chat/route.ts     ← Groq chatbot API
  components/
    Header.tsx
    ChatWidget.tsx        ← דמות בוב וירטואלית עם וידאו
  context/
    CartContext.tsx
  lib/
    supabase.ts
public/
  bob-wave.mp4           ← סרטון בוב מנופף (מקור)
  bob-talk.mp4           ← סרטון בוב מדבר (מקור)
  bob-wave-crop.mp4      ← סרטון חתוך crop=1500:1080:210:0
  bob-talk-crop.mp4      ← סרטון חתוך crop=1500:1080:210:0
  bob-character.png      ← תמונת בוב ללא רקע (rembg)

## Trust Bar
- מוסף ב-`globals.css`: class `.trust-item` עם אנימציית shimmer
- 4 פריטים: משלוח חינם / תשלום מאובטח / החזרה / שירות מקצועי
- אייקוני Lucide: Truck, Lock, RotateCcw, Star

## ChatWidget — בוב הדמות הוירטואלית
- קומפוננטה: `src/components/ChatWidget.tsx`
- מצבים: `wave` (מנופף) / `talk` (מדבר) / `idle`
- כשסגור: בועת ענן SVG + וידאו קטן (200px)
- כשפתוח: חלון שיחה מלא עם וידאו (220px גובה) + הודעות
- חיבור ל-Groq דרך `/api/chat`
- System prompt: מידע על החנות בלבד

## מה עוד לא גמור
1. **תמונות Hero** — שקופית 3 (photo-1590725140246) רקע טורקיז לא מתאים — צריך להחליף
2. **מרסס חשמלי 650W** — תמונה שבורה (photo-1618090584126) — צריך URL תקין
3. **לימוד בוב** — system prompt צריך מידע מפורט יותר על מוצרים/קטגוריות
4. **שיפור נראות ChatWidget** — בועת ענן SVG לשיפור
5. תשלום אמיתי (Stripe/PayPlus)
6. Auth אמיתי + אזור אישי
7. חיפוש פונקציונלי
8. דף Checkout
9. סנכרון Hyp API

## קטגוריות קיימות ב-DB
- חשמל (`electric`)
- מכשירי חשמל (`appliances`)
- חומרי איטום (`sealing`)
- שכפול מפתחות (`keys`)
- אינסטלציה (`plumbing`)
- גז (`gas`)
- קידוד שלטים (`remotes`)
- כיתיים (`locks`)

## קטגוריות בדף הבית (CATEGORIES array)
בניין ושיפוץ → photo-1503387762-592deb58ef4e
כלי עבודה   → photo-1426927308491-6380b6a9936f
חשמל        → photo-1621905251918-48416bd8575a
צבע וגימור  → photo-1589939705384-5185137a7f0f
אינסטלציה   → photo-1504307651254-35680f356dfd
גינה וחוץ   → photo-1416879595882-3373a0480b5b
דלתות וחלונות → photo-1558618666-fcd25c85cd64
ריצוף       → photo-1581578731548-c64695cc6952

## Hero Slides (3 שקופיות)
שקופית 1: photo-1504307651254-35680f356dfd — כלי בנייה
שקופית 2: photo-1581578731548-c64695cc6952 — כלי עבודה
שקופית 3: photo-1590725140246-20acddc1ec6d — רקע טורקיז (לשינוי!)

## כללי עבודה
1. RTL בכל מקום
2. Lucide icons בלבד (לא אימוג'ים)
3. צבעים: זהב/ירוק/אפור
4. עיצוב מינימליסטי מודרני
5. `next.config.mjs` (לא `.ts`)
6. git add . && git commit -m "..." && git push → Vercel auto-deploy

## פקודות שימושיות
```bash
# הרצה מקומית
cd ~/Desktop/2bn-tech/bob && npm run dev

# דיפלוי
cd ~/Desktop/2bn-tech/bob && git add . && git commit -m "תיאור" && git push

# crop לסרטון
ffmpeg -i input.mp4 -vf "crop=1500:1080:210:0" output.mp4 -y

# הסרת רקע מתמונה
python3 -c "from rembg import remove; ..."
```

## קרדיט
עיצוב ובנייה: [2bnmedia.com](https://2bnmedia.com)
