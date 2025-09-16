"use client";

import React, { useState } from "react";
import UserHeader from "../UserHeader";
import Footer from "../Footer";

// Sample categories and products data
const categories = [
  { id: "all", name: "All Product" },
  { id: "home", name: "For Home" },
  { id: "music", name: "For Music" },
  { id: "phone", name: "For Phone" },
  { id: "storage", name: "For Storage" },
];

const products = [
  {
    id: 1,
    name: "Phone Holder Sakti",
    category: "other",
    price: 29.9,
    rating: 5,
    reviews: 1200,
    image: "/phone-holder.png",
  },
  {
    id: 2,
    name: "Headsound",
    category: "music",
    price: 12,
    rating: 5,
    reviews: 1200,
    image: "/headphones.png",
  },
  {
    id: 3,
    name: "Adudu Cleaner",
    category: "other",
    price: 29.9,
    rating: 4.4,
    reviews: 100,
    image: "/cleaner.png",
  },
  // Add more products as needed
];

function ProductCard({ product, isLoggedIn }) {
  return (
    <div className="border rounded p-4 shadow-sm">
      <div className="h-40 flex items-center justify-center bg-gray-100 mb-4">
        <img src={product.image} alt={product.name} className="max-h-full" />
      </div>
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.category}</p>
      <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
      <div className="flex space-x-2 mt-2">
        <button
          disabled={!isLoggedIn}
          className={`px-3 py-1 rounded ${
            isLoggedIn ? "bg-gray-800 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Add to Cart
        </button>
        <button
          disabled={!isLoggedIn}
          className={`px-3 py-1 rounded ${
            isLoggedIn ? "bg-black text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <>
      <UserHeader isLoggedIn={isLoggedIn} />
      <main className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Shop</h1>
        <div className="flex space-x-6">
          <aside className="w-48">
            <h2 className="font-semibold mb-4">Category</h2>
            <ul>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`block w-full text-left px-3 py-1 rounded mb-1 ${
                      selectedCategory === cat.id
                        ? "bg-gray-800 text-white"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
          <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </section>
        </div>
        <button
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {isLoggedIn ? "Logout" : "Login"}
        </button>
      </main>
      <Footer />
    </>
  );
}
