"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Banner = {
  _id: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
  image?: string | null;
  leftImage?: string | null;
  leftImages?: string[];
  rightImages?: string[];
  layout?: string;
};

export default function HeroBanner({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);
  const pointerStartX = useRef<number | null>(null);

  // Autoplay with pause support
  useEffect(() => {
    const tick = () => {
      if (!pausedRef.current) setIndex((i) => (i + 1) % Math.max(1, banners.length));
    };
    const id = setInterval(tick, 5000);
    return () => clearInterval(id);
  }, [banners.length]);

  useEffect(() => {
    // small delay to trigger entrance animation
    const id = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(id);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const prev = () => setIndex((i) => (i - 1 + banners.length) % banners.length);
  const next = () => setIndex((i) => (i + 1) % banners.length);

  // Pause on hover/focus
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onEnter = () => (pausedRef.current = true);
    const onLeave = () => (pausedRef.current = false);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('focusin', onEnter);
    el.addEventListener('focusout', onLeave);
    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('focusin', onEnter);
      el.removeEventListener('focusout', onLeave);
    };
  }, []);

  // Pointer swipe handlers
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onDown = (e: PointerEvent) => {
      pointerStartX.current = e.clientX;
      (e.target as Element).setPointerCapture?.(e.pointerId);
    };
    const onUp = (e: PointerEvent) => {
      if (pointerStartX.current == null) return;
      const delta = e.clientX - pointerStartX.current;
      const threshold = 50;
      if (delta > threshold) prev();
      else if (delta < -threshold) next();
      pointerStartX.current = null;
    };
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointerup', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointerup', onUp);
    };
  }, [banners.length]);

  if (!banners || banners.length === 0) return null;
  const b = banners[index];

  // If banner contains left/right image stacks, render a 3-column layout
  const hasStacks = Array.isArray((b as any).leftImages) && (b as any).leftImages.length >= 2 && Array.isArray((b as any).rightImages) && (b as any).rightImages.length >= 2;

  return (
    <section ref={containerRef} className="mx-auto max-w-7xl px-4 py-8">
      {hasStacks ? (
        <div className="grid gap-4 md:grid-cols-3 items-stretch">
          {/* Left stack */}
          <div className="flex flex-col gap-4">
            {(b as any).leftImages.slice(0, 2).map((src: string, i: number) => (
              <a key={i} href={(b as any).ctaUrl || '/products'} className="block overflow-hidden rounded-lg shadow-sm bg-gray-100 h-40 md:h-56 relative">
                <Image src={src} alt={b.title || `left-${i}`} fill className="object-cover transition-transform duration-500 hover:scale-105" />
              </a>
            ))}
          </div>

          {/* Center content */}
          <div className="relative rounded-lg overflow-hidden shadow-lg">
            {b.image ? (
              <Image src={b.image} alt={b.title || 'Banner'} fill className="object-cover transform transition-transform duration-700 hover:scale-105" priority />
            ) : (
              <div className="h-72 bg-gradient-to-r from-gray-200 to-gray-300" />
            )}

            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`max-w-3xl text-center px-6 py-8 bg-white/10 backdrop-blur-sm rounded-lg transition-all duration-600 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    {b.title && <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white drop-shadow-md">{b.title}</h2>}
                    {b.subtitle && <p className="mt-3 text-base sm:text-lg text-gray-100 max-w-2xl mx-auto">{b.subtitle}</p>}
                    <div className="mt-6 flex items-center justify-center gap-3">
                      <a href={(b as any).ctaUrl || '#products'} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 font-semibold shadow-lg hover:scale-105 transition">Shop now</a>
                      <Link href="/category" className="inline-flex items-center gap-2 rounded-full border border-white/30 text-white px-4 py-2 backdrop-blur-sm">Explore categories</Link>
                    </div>
                    <div className="mt-4 text-sm text-white/80">Free shipping on orders over ETB 75 · 30-day returns</div>
                  </div>
            </div>
          </div>

          {/* Right stack */}
          <div className="flex flex-col gap-4">
            {(b as any).rightImages.slice(0, 2).map((src: string, i: number) => (
              <a key={i} href={(b as any).ctaUrl || '/products'} className="block overflow-hidden rounded-lg shadow-sm bg-gray-100 h-40 md:h-56 relative">
                <Image src={src} alt={b.title || `right-${i}`} fill className="object-cover transition-transform duration-500 hover:scale-105" />
              </a>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden shadow-lg">
          {b.image ? (
            <Image src={b.image} alt={b.title || 'Banner'} fill className="object-cover transform transition-transform duration-700 hover:scale-105" priority />
          ) : (
            <div className="h-80 bg-gradient-to-r from-gray-200 to-gray-300" />
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-3xl text-center px-6 py-8 bg-white/10 backdrop-blur-sm rounded-lg">
              {b.title && <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white drop-shadow-md">{b.title}</h2>}
              {b.subtitle && <p className="mt-3 text-base sm:text-lg text-gray-100 max-w-2xl mx-auto">{b.subtitle}</p>}
              <div className="mt-6 flex items-center justify-center gap-3">
                <a href={(b as any).ctaUrl || '#products'} className="inline-flex items-center gap-2 rounded-full bg-white text-blue-700 px-4 py-2 font-semibold shadow hover:scale-105 transition">Shop now</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* indicators and controls */}
      <div className="mt-4 flex items-center justify-center gap-3 relative">
        <div className="flex gap-2">
          {banners.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} aria-label={`Go to banner ${i + 1}`} className={`w-3 h-3 rounded-full transition-all ${i === index ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'}`}></button>
          ))}
        </div>

        {/* Overlay arrow buttons */}
        <button aria-label="Previous banner" onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg hover:scale-105 transition" style={{transformOrigin: 'center'}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button aria-label="Next banner" onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg hover:scale-105 transition" style={{transformOrigin: 'center'}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700"><path d="M9 6l6 6-6 6"/></svg>
        </button>
      </div>
    </section>
  );
}
