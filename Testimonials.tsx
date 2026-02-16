"use client";
import { useEffect, useState } from 'react';

export default function Testimonials({ items }: { items: { quote: string; author: string; role?: string }[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 4500);
    return () => clearInterval(t);
  }, [items.length]);

  if (!items || items.length === 0) return null;

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <blockquote className="text-gray-800 dark:text-gray-100 italic">“{items[idx].quote}”</blockquote>
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">— {items[idx].author}{items[idx].role ? `, ${items[idx].role}` : ''}</div>
      <div className="mt-4 flex gap-2">
        {items.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} className={`w-2 h-2 rounded-full ${i === idx ? 'bg-indigo-600' : 'bg-gray-300'}`} aria-label={`Go to testimonial ${i+1}`} />
        ))}
      </div>
    </div>
  );
}
