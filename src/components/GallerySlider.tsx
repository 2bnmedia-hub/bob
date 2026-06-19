"use client";

import { useEffect, useState } from "react";

const SLIDES = [
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&q=80",
  "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1600&q=80",
  "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=1600&q=80",
  "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=1600&q=80",
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1600&q=80",
  "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=1600&q=80",
];

export default function GallerySlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative mx-auto h-[60vh] w-full max-w-[96vw] min-h-[320px] overflow-hidden px-5">
      <div className="relative h-full w-full overflow-hidden rounded-[var(--radius-md)]">
        {SLIDES.map(function (src, i) {
          return (
            <img
              key={i}
              src={src}
              alt={"תמונה מהגלריה " + (i + 1)}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
              style={{ opacity: i === index ? 1 : 0 }}
            />
          );
        })}
        <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2">
          {SLIDES.map(function (_, i) {
            return (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={"שקופית " + (i + 1)}
                className="h-2 w-2 rounded-full transition"
                style={{ background: i === index ? "#ffffff" : "rgba(255,255,255,0.45)" }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
