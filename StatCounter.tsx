"use client";
import { useEffect, useState } from 'react';

export default function StatCounter({ value, suffix = '', duration = 1200 }: { value: number; suffix?: string; duration?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let start = Date.now();
    const from = 0;
    const to = value;
    let raf = 0;
    const step = () => {
      const t = Math.min(1, (Date.now() - start) / duration);
      setN(Math.round(from + (to - from) * t));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <span className="text-2xl font-bold text-gray-900 dark:text-white">{n.toLocaleString()}{suffix}</span>;
}
