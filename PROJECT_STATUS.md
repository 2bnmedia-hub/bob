# פרויקט: בוב חומרי בניין — סטטוס

## מיקום הפרויקט
`~/Desktop/2bn-tech/bob` (משתמש: `was`)
Repo: https://github.com/2bnmedia-hub/bob.git

## עדכון אחרון: 19.6.2026

### 1. ChatWidget.tsx — כפתור סגירה (X) + עיגול מיני
- נוסף state `dismissed` + תנאי `{shown && !dismissed && (...)}`
- כפתור X על הבועה (לא על בוב המוקטן) → מפעיל `setDismissed(true)`
- כשסגור: מוצג עיגול קטן וגרורי עם וידאו `bob-wave.mp4` (לופ, muted)
- לחיצה על העיגול (בלי גרירה) → `setDismissed(false)` ומחזיר את הוידג'ט
- לוגיקת drag לעיגול: `didDrag` ref מבדיל בין קליק לגרירה, חולק `widgetRef` עם הוידג'ט הרגיל (הם לא מוצגים בו-זמנית, אז זה בטוח)
- קובץ גיבוי קיים בלוקאלי: `src/components/ChatWidget.tsx.backup` (לא ב-git, לא ב-commit)

### 2. page.tsx — תיקון אייקוני לוגו שבורים בסקשן "המותגים המובילים"
- הלוגואים נטענים מ-Clearbit (`https://logo.clearbit.com/{domain}`)
- היה `onError` שמחביא תמונה שנכשלת ומציג טקסט חלופי — אבל לא תפס מקרים שClearbit מחזיר 200 עם תמונה ריקה/פגומה
- נוסף `onLoad` שבודק `naturalWidth === 0` ומפעיל את אותה לוגיקת fallback (הסתרת תמונה, הצגת `<span>{name}</span>`)
- תוקן ב-commit: "Fix broken brand logo icons with naturalWidth fallback" (f6efa0f)

### 3. globals.css
- תוקן `--brown-dark` שהוגדר בטעות כ-#F5F5F5 (בהיר) → תוקן לחום כהה #3D2614 (תיקון ניגודיות טקסט)

## Git
- Branch: `main`, מחובר ל-`origin/main`
- שני קומיטים אחרונים הועלו ונדפלוי (ככל הנראה אוטומטית דרך Vercel)

## פתוח / ממתין
- לאשר שהדפלוי בפרודקשן עלה בהצלחה ונראה תקין (לא בדקנו URL פרודקשן בפועל בסשן הזה)
- שאלה: האם 3M ו-Valspar עדיין מציגים רק טקסט (היו כך מההתחלה, לא תמונה כלל)?
