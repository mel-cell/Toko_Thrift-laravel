import React from "react";

export default function UserHeader() {
  return (
    <header className="w-full bg-white shadow-md p-4 flex items-center justify-between">
      <div className="text-xl font-bold">Stuffus</div>
      <nav className="space-x-4">
        <a href="/" className="hover:underline">Beranda</a>
        <a href="/shop" className="hover:underline">Shop</a>
        <a href="/blog" className="hover:underline">Blog</a>
      </nav>
      <div className="flex items-center space-x-4">
        {/* Placeholder for search, cart, avatar etc */}
        <button aria-label="Search" className="p-2 rounded hover:bg-gray-200">
          🔍
        </button>
        <button aria-label="Cart" className="p-2 rounded hover:bg-gray-200">
          🛒
        </button>
        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
      </div>
    </header>
  );
}
