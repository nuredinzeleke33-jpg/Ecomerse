import React from "react";
import ModernHeroBanner from "./components/ModernHeroBanner";
import DefaultBannerSection from './components/DefaultBannerSection';
import ProductGrid from "./components/ProductGrid";
import Image from "next/image";
import Link from "next/link";

import { client } from "../sanity/lib/client";
import { urlFor } from "../sanity/lib/image";

type SanityBanner = any;
type SanityCategory = any;
type SanityProduct = any;

async function fetchHomeData() {
  // fetch banners including optional left/right images and cta
  const banners: SanityBanner[] = await client.fetch(`*[_type == "banner"] | order(_createdAt desc){ _id, title, description, image, leftImage, rightImages, ctaUrl }`);

  const categories: SanityCategory[] = await client.fetch(`*[_type == "category"] | order(title asc){_id, title, description, image, "slug": slug[0].current}`);

  const products: SanityProduct[] = await client.fetch(`*[_type == "product"] | order(_createdAt desc)[0...12]{_id, title, price, discriptio, image, "slug": slug[0].current, "category": catagory->title}`);

  return { banners, categories, products };
}

export default async function Page() {
  const { banners, categories, products } = await fetchHomeData();

  // helper: only call urlFor when the image has an asset or ref
  const safeUrl = (src: any) => {
    try {
      if (!src) return null;
      if (typeof src === 'string') return urlFor(src);
      if (src.asset || src._ref) return urlFor(src);
      return null;
    } catch (e) {
      return null;
    }
  };

  // compute a lightweight subtitle but keep the original banner object
  const enrichedBanners = (banners || []).map((b: SanityBanner) => {
    const subtitle = Array.isArray(b.description)
      ? b.description.map((blk: any) => (blk.children || []).map((c: any) => c.text || '').join('')).join(' ')
      : '';
    return { ...b, subtitle };
  });

  // Default modern Nurye Shope banner when no banners are provided from Sanity
  const defaultBanner = {
    _id: 'default-nurye-banner',
    title: 'Nurye Shope',
    subtitle: 'Quality essentials — fast delivery across Ethiopia',
    ctaText: 'Shop Bestsellers',
    ctaUrl: '/products',
    image: null,
  };
  const bannersToShow = enrichedBanners.length > 0 ? enrichedBanners : [defaultBanner];

  const mappedCategories = (categories || []).map((c: SanityCategory) => ({
    _id: c._id,
    title: c.title,
    slug: c.slug || null,
    image: safeUrl(c.image) ? safeUrl(c.image)!.width(600).height(400).auto('format').url() : null,
  }));

  const mappedProducts = (products || []).map((p: SanityProduct) => ({
    _id: p._id,
    title: p.title,
    price: p.price,
    description: p.discriptio || "",
    image: safeUrl(p.image) ? safeUrl(p.image)!.width(800).height(600).auto('format').url() : null,
    slug: p.slug || null,
    category: p.category || null,
  }));

  return (
    <main className="space-y-12">
      {/* Hero / Banner carousel */}
      <ModernHeroBanner banners={bannersToShow} />

      {/* Default modern banner section (promotional cards) */}
      <DefaultBannerSection />

      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Shop by Category</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {mappedCategories.map((c) => (
            <Link key={c._id} href={`/category/${c.slug || c._id}`} className="group block overflow-hidden rounded-xl border bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md transform hover:-translate-y-1 transition">
              <div className="relative h-48 w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {c.image ? (
                  <Image src={c.image} alt={c.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">No image</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute left-4 bottom-4 text-white font-semibold drop-shadow">{c.title}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="products" className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
        </div>

        <div className="rounded-lg border bg-white/50 p-6 shadow-sm">
          <ProductGrid products={mappedProducts} />
        </div>
      </section>
    </main>
  );
}
