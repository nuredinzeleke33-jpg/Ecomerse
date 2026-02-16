"use client";
import React from "react";

export default function Newsletter() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-12 text-center">
      <h3 className="text-2xl font-semibold">Join our newsletter</h3>
      <p className="mt-2 text-sm text-gray-600">Get early access to new products and deals.</p>
      <form className="mt-4 flex w-full gap-2" onSubmit={(e) => e.preventDefault()}>
        <input aria-label="Email" placeholder="you@example.com" className="flex-1 rounded-lg border px-4 py-3" />
        <button className="rounded-lg bg-blue-600 px-4 py-3 text-white font-semibold">Subscribe</button>
      </form>
    </section>
  );
}
