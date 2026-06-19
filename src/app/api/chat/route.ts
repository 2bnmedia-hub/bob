import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `אתה סוכן שירות לקוחות של חנות "בוב חומרי בניין". 
אתה עונה ONLY בעברית, בצורה קצרה וידידותית.
אתה עונה רק על שאלות שקשורות לחנות ולמוצרים שלה.
אם שאלה לא קשורה לחנות — תגיד: "אני יכול לעזור רק בנושאי חנות בוב חומרי בניין 😊"

מידע על החנות:
- שם: בוב חומרי בניין
- אתר: bob-alpha.vercel.app
- קטגוריות: בניין ושיפוץ, כלי עבודה, חשמל, צבע וגימור, אינסטלציה, גינה וחוץ, דלתות וחלונות, ריצוף
- שירותים: שכפול מפתחות, קידוד שלטים, ייעוץ מקצועי חינם, חיתוך חומרים במקום, משלוח עד הבית, התקנה
- משלוח: חינם מעל ₪400, משלוח מהיר לכל הארץ
- החזרה: תוך 30 יום
- תשלום: מאובטח
- מותגים: DeWalt, Milwaukee, Bosch, Makita, Stanley, Hilti, Festool, Stihl`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 300,
      temperature: 0.4,
    }),
  });

  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content ?? 'שגיאה, נסה שוב';
  return NextResponse.json({ reply });
}
