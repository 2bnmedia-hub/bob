import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ConditionalHeader, ConditionalFooter } from "@/components/ConditionalHeader";
import ChatWidget from "@/components/ChatWidget";


export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "בוב חומרי בניין",
  description: "כל מה שצריך לבנייה ושיפוץ — חומרי בניין, כלי עבודה ומצרכי בית.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <CartProvider>
          {!pathname?.startsWith("/admin") <ConditionalHeader /><Header /> <Header />}
          {children}
          <ChatWidget />
          <ConditionalFooter />
        </CartProvider>
      </body>
    </html>
  );
}
