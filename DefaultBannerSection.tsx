import Link from 'next/link'

export default function DefaultBannerSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid gap-6 md:grid-cols-3 items-stretch">
        {/* Large hero area */}
        <div className="md:col-span-2 rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white p-8 flex flex-col justify-between shadow-2xl overflow-hidden">
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-md">Nurye Shope</h2>
            <p className="mt-4 max-w-2xl text-sm sm:text-base text-indigo-100/90">Quality essentials for everyday life — curated favorites, great value, and fast delivery across Ethiopia.</p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link href="/products" className="inline-flex items-center gap-3 rounded-full bg-white text-indigo-700 px-5 py-3 font-semibold shadow-lg transform transition hover:-translate-y-0.5">Shop Bestsellers</Link>
            <Link href="/about" className="inline-flex items-center gap-2 rounded-full border border-white/30 text-white px-4 py-2 backdrop-blur-sm hover:bg-white/10 transition">About Nurye</Link>
            <div className="ml-auto hidden sm:flex items-center gap-3 text-xs text-indigo-100/80">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">🚚</div>
                <div>
                  <div className="font-semibold">Fast delivery</div>
                  <div className="text-xs">Same-week in major cities</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right stacked promo cards */}
        <div className="flex flex-col gap-4">
          <Link href="/products" className="group block overflow-hidden rounded-2xl bg-white/90 dark:bg-gray-800/70 shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="p-4 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center text-yellow-700 text-lg">★</div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Bestsellers</h4>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">Popular items loved by our customers.</p>
              </div>
            </div>
          </Link>

          <Link href="/products" className="group block overflow-hidden rounded-2xl bg-white/90 dark:bg-gray-800/70 shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="p-4 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-green-700 text-lg">✔</div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Trusted Quality</h4>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">Products inspected and verified by our team.</p>
              </div>
            </div>
          </Link>

          <Link href="/about" className="group block overflow-hidden rounded-2xl bg-white/90 dark:bg-gray-800/70 shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="p-4 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 text-lg">☎</div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Local Support</h4>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">Friendly customer support and easy returns.</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
