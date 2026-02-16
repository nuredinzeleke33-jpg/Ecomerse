"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import createImageUrlBuilder from '@sanity/image-url';
import { projectId, dataset } from '../../sanity/env';

const builder = createImageUrlBuilder({ projectId, dataset });
const imgFor = (src: any) => (src ? builder.image(src) : null);

type RawBanner = any;

export default function ModernHeroBanner({ banners, autoplay = true, interval = 6000 }: { banners: RawBanner[]; autoplay?: boolean; interval?: number }) {
  const [index, setIndex] = useState(0);
  const paused = useRef(false);
  const startX = useRef<number | null>(null);

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % Math.max(1, banners.length));
    }, interval);
    return () => clearInterval(id);
  }, [autoplay, interval, banners.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + banners.length) % banners.length);
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % banners.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [banners.length]);

  if (!banners || banners.length === 0) return null;

  const prev = () => setIndex((i) => (i - 1 + banners.length) % banners.length);
  const next = () => setIndex((i) => (i + 1) % banners.length);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="relative overflow-hidden rounded-2xl shadow-xl">
        {banners.map((b: RawBanner, i: number) => {
          const active = i === index;
          const img = imgFor(b.image);
          const bg = img ? img.width(active ? 1600 : 1200).auto('format').url() : null;

          return (
            <div
              key={b._id || i}
              aria-hidden={!active}
              className={`absolute inset-0 transition-transform duration-700 ${active ? 'translate-x-0 z-10' : 'translate-x-full z-0'}`}
              style={{ transform: `translateX(${(i - index) * 100}%)` }}
            >
              <div className="relative h-72 sm:h-96 md:h-[520px] w-full bg-gradient-to-br from-gray-50 to-gray-200">
                {bg ? (
                  <Image src={bg} alt={b.title || 'Banner image'} fill className="object-cover" priority={active} />
                ) : (
                  <div className="h-full w-full bg-gradient-to-r from-gray-300 to-gray-400" />
                )}

                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="max-w-3xl text-center px-6 py-8 bg-white/10 backdrop-blur-sm rounded-lg">
                    {b.title && <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-md">{b.title}</h2>}
                    {b.subtitle && <p className="mt-3 text-sm sm:text-lg text-gray-100">{b.subtitle}</p>}
                    <div className="mt-6 flex items-center justify-center gap-3">
                      <Link href={b.ctaUrl || '/products'} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-5 py-2 font-semibold shadow-lg">{b.ctaText || 'Shop now'}</Link>
                      <Link href="/category" className="inline-flex items-center gap-2 rounded-full border border-white/30 text-white px-4 py-2">Categories</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* controls */}
        <button aria-label="Previous" onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button aria-label="Next" onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6"/></svg>
        </button>

        {/* indicators */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex gap-2">
          {banners.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} aria-label={`Go to slide ${i + 1}`} className={`w-3 h-3 rounded-full ${i === index ? 'bg-white' : 'bg-white/40'}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
