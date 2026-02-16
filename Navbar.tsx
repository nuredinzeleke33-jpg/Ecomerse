"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";
import { FaSearch, FaShoppingBag, FaUserAstronaut, FaMoon, FaSun } from "react-icons/fa";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = false;
  const { cartCount, flashKey } = useCart();

  // search state
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pulse, setPulse] = useState(false);

  const toggleDarkMode = () => {
    const next = !darkMode;
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', next);
      try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch (e) {}
      try { localStorage.setItem('themeSetByUser', 'true'); } catch (e) {}
    }
    setDarkMode(next);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setMounted(true);
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark') { document.documentElement.classList.add('dark'); setDarkMode(true); return; }
      if (stored === 'light') { document.documentElement.classList.remove('dark'); setDarkMode(false); return; }
      const prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefers);
      setDarkMode(prefers);
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!flashKey) return;
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 900);
    return () => clearTimeout(t);
  }, [flashKey, mounted]);

  // close dropdown on outside click
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target) && inputRef.current && !inputRef.current.contains(target)) {
        setShowResults(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  // debounce search
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (!query || query.trim().length < 2) { setResults([]); setLoadingResults(false); return; }
    setLoadingResults(true);
    debounceRef.current = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const json = await res.json();
        setResults(json.results || []);
      } catch (e) {
        setResults([]);
      } finally {
        setLoadingResults(false);
      }
    }, 300) as unknown as number;
    return () => { if (debounceRef.current) window.clearTimeout(debounceRef.current); };
  }, [query]);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-200/30 bg-white/80 backdrop-blur-md dark:border-gray-700/40 dark:bg-gray-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-blue-600 dark:text-blue-400">Nurye Shop</Link>

          {/* search center */}
          <div className="hidden md:flex flex-1 justify-center px-6">
            <div className="relative w-full max-w-md">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-blue-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
                onFocus={() => setShowResults(true)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(results.length - 1, i + 1)); }
                  if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(-1, i - 1)); }
                  if (e.key === 'Enter') {
                    if (activeIndex >= 0 && results[activeIndex]) {
                      const r = results[activeIndex];
                      const dest = r.slug || r._id;
                      router.push(`/products/${encodeURIComponent(dest)}`);
                    } else if (query.trim()) {
                      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
                    }
                    setShowResults(false);
                  }
                  if (e.key === 'Escape') { setShowResults(false); }
                }}
                placeholder="Search products..."
                className="w-full rounded-full border border-blue-400/40 bg-white/70 py-1.5 pl-9 pr-4 text-xs text-gray-700 shadow-sm backdrop-blur focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-blue-600/40 dark:bg-gray-800/60 dark:text-gray-200"
              />

              {showResults && (
                <div ref={dropdownRef} className="absolute left-0 right-0 mt-2 max-h-80 overflow-auto rounded-lg bg-white shadow-lg ring-1 ring-black/5 z-50">
                  {loadingResults ? (
                    <div className="p-3 text-sm text-gray-500">Loading…</div>
                  ) : results.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500">No results</div>
                  ) : (
                    <ul>
                      {results.map((r, idx) => (
                        <li key={r._id} className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${idx === activeIndex ? 'bg-gray-100' : ''}`} onMouseEnter={() => setActiveIndex(idx)} onClick={() => { const dest = r.slug || r._id; router.push(`/products/${encodeURIComponent(dest)}`); setShowResults(false); }}>
                          <div className="text-sm font-medium text-gray-900">{r.title}</div>
                          {r.price !== undefined && <div className="text-xs text-gray-500">{new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(r.price)}</div>}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-xs font-medium text-gray-700 transition hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400">{link.name}</Link>
            ))}

            {isAdmin && (
              <Link href="/studio" className="text-xs font-medium text-blue-700 dark:text-blue-300 border border-blue-500 rounded-full px-4 py-1 transition hover:bg-blue-50 dark:hover:bg-blue-800/10 ml-2">Studio</Link>
            )}

            <div className="flex items-center gap-2">
              <Link href="/signup/login" className="rounded-full border border-blue-500 px-3 py-1 text-xs font-medium text-blue-600 transition hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400/10">Login</Link>
              <Link href="/signup" className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-blue-700">Sign Up</Link>
            </div>

            <div className="ml-2 flex items-center gap-5">
              <button onClick={toggleDarkMode} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleDarkMode(); } }} className="group relative" aria-label="Toggle dark mode" aria-pressed={darkMode} title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
                <div className="rounded-full p-1 transition group-hover:bg-blue-500/10">{darkMode ? <FaSun className="text-sm text-yellow-400 transition group-hover:scale-110" /> : <FaMoon className="text-sm text-gray-500 transition group-hover:scale-110 dark:text-gray-300" />}</div>
              </button>

              <Link href="/cart" className="group relative">
                <div className={`rounded-full p-1 transition group-hover:bg-blue-500/10 ${pulse ? 'scale-110' : ''}`}><FaShoppingBag className="text-sm text-blue-500 transition group-hover:scale-110" /></div>
                {pulse && (<span className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full animate-ping" />)}
                {mounted && cartCount > 0 && (<span className="absolute -top-1 -right-1 rounded-full bg-red-500 px-1 text-[9px] text-white">{cartCount}</span>)}
              </Link>

              <div className="relative">
                <button onClick={() => setProfileOpen(p => !p)} className="group relative"><div className="rounded-full p-1 transition group-hover:bg-purple-500/10"><FaUserAstronaut className="text-sm text-purple-500 transition group-hover:scale-110" /></div></button>
                {profileOpen && (<div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded shadow-lg ring-1 ring-black/5 p-1"><button onClick={async () => { try { await signOut(auth); window.location.href = '/signup/login'; } catch (e) { console.error(e); alert('Logout failed'); } }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Logout</button></div>)}
              </div>
            </div>
          </div>

          {/* Mobile Button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-lg text-gray-700 dark:text-gray-200">☰</button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden space-y-3 bg-white px-4 pb-4 dark:bg-gray-900">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} onClick={() => setMobileOpen(false)} className="block text-sm text-gray-700 dark:text-gray-200">{link.name}</Link>
          ))}

          <div className="flex gap-2 pt-2">
            <Link href="/signup/login" className="flex-1 rounded-md border border-blue-500 py-1.5 text-center text-sm text-blue-600">Login</Link>
            <Link href="/signup" className="flex-1 rounded-md bg-blue-600 py-1.5 text-center text-sm text-white">Sign Up</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
