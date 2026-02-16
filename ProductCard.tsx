"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartContext";

type Product = {
  _id: string;
  title: string;
  vendor?: string;
  image?: string | null;
  gallery?: string[];
  price?: number;
  description?: any;
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    setAdding(true);
    try {
      addToCart({ _id: product._id, title: product.title, price: product.price || 0, image: product.image || "", quantity: 1 });
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setAdding(false), 600);
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-transform transform hover:-translate-y-1 hover:shadow-lg dark:bg-gray-900">
      <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
        {product.image ? (
          <Image src={product.image} alt={product.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 50vw" />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">No image</div>
        )}

        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-blue-600 shadow">
          {new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(product.price || 0)}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-semibold line-clamp-2">{product.title}</h3>
        </div>

        <p className="text-xs text-gray-500 line-clamp-2">{product.description ? (typeof product.description === "string" ? product.description : "") : ""}</p>

        <div className="mt-4 flex items-center gap-3">
          <button onClick={handleAdd} disabled={adding} className="rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-sm font-medium text-white hover:from-blue-700 disabled:opacity-60 transition">
            {adding ? "Adding..." : "Add to cart"}
          </button>

          <Link href={`/products`} className="text-sm inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 dark:text-gray-200">
            <span className="px-3 py-1.5 rounded-md bg-white/90 text-sm font-medium shadow-sm hover:scale-105 transition">View</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
