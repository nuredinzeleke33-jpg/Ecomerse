"use client";

import React from "react";
import ProductCard from "./ProductCard";

type Product = {
  _id: string;
  title: string;
  vendor?: string;
  image?: string | null;
  gallery?: string[];
  price?: number;
  description?: any;
};

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}
