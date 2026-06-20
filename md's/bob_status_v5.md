# פרויקט בוב חומרי בניין — סטטוס v5

## מידע כללי
- **תאריך עדכון**: 19 יוני 2026
- **גרסה**: v5
- **מפתח**: [2bnmedia.com](https://2bnmedia.com)

## URLs
- **Production**: https://bob-alpha.vercel.app
- **Admin Panel**: https://bob-alpha.vercel.app/admin
- **Admin Login**: https://bob-alpha.vercel.app/admin/login
- **GitHub**: https://github.com/2bnmedia-hub/bob
- **Local dev**: http://localhost:3000

## טכנולוגיה
- Next.js 16.2.9 + TypeScript
- פונט: Open Sans — Google Fonts
- Lucide React — אייקונים
- Chart.js 4.4.1 — גרפים ועוגות
- `next.config.mjs`
- Supabase — בסיס נתונים + Auth
- Vercel — דיפלוי אוטומטי בכל push
- xlsx — ייבוא קבצי Excel

## Supabase
- URL: `https://qaneanzpipjtnlonqmyd.supabase.co`
- Anon key: שמור ב-`.env.local` ובמשתני Vercel
- טבלאות: `categories`, `products`, `orders`, `order_items`
- Auth: Email + Password (מובנה ב-Supabase)

## צבעי מותג
- זהב: `#F0C040` / `#FCD34D`
- ירוק: `#2D6A4F`
- רקע: `#FFFFFF` / `#F5F5F5`

---

## לוח בקרה — Admin Panel (חדש ב-v5)

### מיקום בפרויקט
```
src/app/admin/
  ├── page.tsx              ← עמוד ראשי + הגנת auth
  ├── layout.tsx            ← Chart.js CDN
  ├── admin.css             ← כל styles של הפאנל
  └── components/
       ├── Sidebar.tsx          ← ניווט צדדי
       ├── Topbar.tsx           ← סרגל עליון + כפתור התנתקות
       ├── LogoutButton.tsx     ← כפתור התנתקות
       ├── DashboardSection.tsx ← סקירה כללית + גרפים
       ├── AnalyticsSection.tsx ← אנליטיקס מלא
       ├── ProductsSection.tsx  ← טבלת מוצרים + פילטר
       ├── CategoriesSection.tsx← קטגוריות + גרף אופקי
       ├── OrdersSection.tsx    ← הזמנות
       └── ImportModal.tsx      ← ייבוא CSV/XLSX/JSON
```

### סעיפי הפאנל
| סעיף | תוכן |
|------|-------|
| סקירה כללית | מדדים, גרף קו מכירות, 2 עוגות (מלאי + הזמנות), בר קטגוריות |
| אנליטיקס | בר שבועי הכנסות, עוגת פאי מכירות, גרף קו כפול מגמות, בר ייבוא |
| מוצרים | טבלה עם פילטר מלאי, מיון, עימוד 20 שורות, חיפוש חי |
| קטגוריות | בר אופקי + טבלת קטגוריות מ-Supabase |
| הזמנות | רשימת הזמנות עם סטטוסים |

### גרפים ועוגות
- **גרף קו** — מכירות 12 חודשים (toggle חודשי/שבועי)
- **עוגת דונאט** — מצב מלאי (תקין/נמוך/אזל)
- **עוגת דונאט** — הזמנות לפי סטטוס
- **בר אנכי** — קטגוריות מובילות
- **בר שבועי** — הכנסות (שבוע נוכחי בזהב)
- **עוגת פאי** — התפלגות מכירות לפי קטגוריה
- **קו כפול** — מוצרים חדשים vs עדכוני מלאי
- **בר ייבוא** — היסטוריית ייבוא קבצים
- **בר אופקי** — מוצרים לפי קטגוריה

---

## ייבוא קבצים

### פורמטים נתמכים
- CSV
- XLSX / XLS (Excel)
- JSON

### כותרות נתמכות (עברית + אנגלית)
| שדה | כותרות מזוהות |
|-----|----------------|
| שם מוצר | שם, שם מוצר, name, product |
| מחיר | מחיר, price, מחיר מכירה |
| מלאי | מלאי, stock, כמות, qty |
| קטגוריה | קטגוריה, category, cat |
| מק"ט | מק"ט, sku, מקט, barcode |
| תיאור | תיאור, description |

### פורמט CSV לדוגמה
```csv
שם מוצר,מחיר,מלאי,קטגוריה,מק"ט,תיאור
מסור עגול 185mm,289,15,כלי עבודה,TW-185,מסור מקצועי
פנס LED 10W,45,200,חשמל,EL-010,חיסכון בחשמל
צינור PP-R 20mm,12,50,אינסטלציה,PL-020,צינור איכותי
```

### פורמט JSON לדוגמה
```json
[
  { "name": "מסור עגול", "price": 289, "stock": 15, "category": "כלי עבודה", "sku": "TW-185" },
  { "name": "פנס LED", "price": 45, "stock": 200, "category": "חשמל", "sku": "EL-010" }
]
```

### תהליך הייבוא
1. גרור קובץ או לחץ לבחירה
2. תצוגה מקדימה של 8 שורות ראשונות
3. אישור → upsert ל-Supabase בחבילות של 50
4. תוצאה: כמה יובאו + שגיאות אם יש

---

## הגנת Admin — Auth

### זרימת הכניסה
1. גולש נכנס ל `/admin`
2. `page.tsx` בודק session מ-Supabase
3. אם אין session → מועבר ל `/admin/login`
4. מכניס אימייל + סיסמה
5. Supabase מאמת → session נשמר ב-localStorage
6. מועבר ל `/admin`
7. כפתור "התנתק" מנקה session

### יצירת משתמש מנהל
1. כנס ל: https://supabase.com/dashboard
2. בחר פרויקט `bob`
3. Authentication → Users → Add user
4. הכנס אימייל וסיסמה
5. לחץ Create user

### הוספת מנהל נוסף
אותו תהליך — צור משתמש נוסף ב-Supabase Auth.

---

## מבנה הפרויקט המלא

```
src/
  app/
    page.tsx              ← דף הבית
    layout.tsx            ← RTL, Open Sans, CartProvider + Header + ChatWidget
    globals.css           ← צבעי מותג, base styles, RTL
    admin/                ← לוח בקרה (חדש!)
      page.tsx
      layout.tsx
      admin.css
      login/page.tsx
      components/...
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
    services/page.tsx
    tips/page.tsx
    category/[slug]/page.tsx
    product/[slug]/page.tsx
    api/chat/route.ts     ← Groq chatbot
  components/
    Header.tsx
    ChatWidget.tsx
  context/
    CartContext.tsx
  lib/
    supabase.ts
public/
  bob-wave.mp4
  bob-talk.mp4
  bob-wave-crop.mp4
  bob-talk-crop.mp4
  bob-character.png
```

---

## קטגוריות קיימות ב-DB
| שם | Slug |
|----|------|
| חשמל | electric |
| מכשירי חשמל | appliances |
| חומרי איטום | sealing |
| שכפול מפתחות | keys |
| אינסטלציה | plumbing |
| גז | gas |
| קידוד שלטים | remotes |
| כיתיים | locks |

---

## תלויות (package.json)
```json
{
  "dependencies": {
    "next": "16.2.9",
    "react": "^19.0.0",
    "typescript": "^5",
    "@supabase/supabase-js": "latest",
    "@supabase/auth-helpers-nextjs": "^0.15.0",
    "@supabase/ssr": "latest",
    "lucide-react": "latest",
    "xlsx": "latest"
  }
}
```

---

## מה עוד לא גמור
1. **תמונות Hero** — שקופית 3 רקע טורקיז לא מתאים
2. **מרסס חשמלי 650W** — תמונה שבורה
3. **גרפים אמיתיים** — כרגע דמו data, צריך לחבר ל-Supabase
4. **לימוד בוב** — system prompt צריך מידע מפורט על מוצרים
5. תשלום אמיתי (Stripe/PayPlus)
6. Auth אמיתי לאזור אישי לקוחות
7. חיפוש פונקציונלי
8. דף Checkout
9. סנכרון Hyp API
10. **דומיין מותאם** — לחבר דומיין אמיתי ל-Vercel

---

## פקודות שימושיות
```bash
# הרצה מקומית
cd ~/Desktop/2bn-tech/bob && npm run dev

# דיפלוי
cd ~/Desktop/2bn-tech/bob && git add . && git commit -m "תיאור" && git push

# עצירת שרת על פורט 3000
lsof -ti:3000 | xargs kill -9

# crop לסרטון
ffmpeg -i input.mp4 -vf "crop=1500:1080:210:0" output.mp4 -y

# הסרת רקע מתמונה
python3 -c "from rembg import remove; ..."
```

---

## Groq API (צ'אט בוט)
- Key שמור ב-`.env.local` כ-`GROQ_API_KEY`
- מודל: `llama-3.3-70b-versatile`
- API route: `src/app/api/chat/route.ts`
- קומפוננטה: `src/components/ChatWidget.tsx`
- מצבים: `wave` / `talk` / `idle`

---

## כללי עבודה
1. RTL בכל מקום
2. Lucide icons בלבד (לא אימוג'ים) — *חוץ מהאדמין שמשתמש באימוג'ים זמניים*
3. צבעים: זהב / ירוק / אפור
4. עיצוב מינימליסטי מודרני
5. `next.config.mjs` (לא `.ts`)
6. git add . && git commit && git push → Vercel auto-deploy
