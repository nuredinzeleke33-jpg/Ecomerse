"use client";
import { useState } from 'react';

export default function FAQAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full px-4 py-3 flex items-center justify-between text-left"
            aria-expanded={openIndex === i}
          >
            <span className="font-medium text-gray-900 dark:text-gray-100">{it.q}</span>
            <span className="ml-4 text-gray-500">{openIndex === i ? '−' : '+'}</span>
          </button>
          {openIndex === i && (
            <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-300">{it.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}
