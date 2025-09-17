"use client";

import React, { useState } from "react";
import Search from "../../../components/page/user/componentDashboard/search";
import { Button } from "../../../components/ui/button";

const categories = [
  {
    name: "Clothing",
    subcategories: [
      { name: "Shirts" },
      { name: "Pants" },
      { name: "Jackets" },
      { name: "Accessories" },
    ],
  },
  { name: "New Arrival" },
  { name: "Best Seller" },
  { name: "On Discount" },
];

const products = [
  // Sample 30 products (can be extended or fetched from API)
  { id: 1, name: "Classic Shirt", category: "Shirts", price: 19.99, image: "/images/classic-shirt.jpg" },
  { id: 2, name: "Denim Pants", category: "Pants", price: 29.99, image: "/images/denim-pants.jpg" },
  { id: 3, name: "Leather Jacket", category: "Jackets", price: 59.99, image: "/images/leather-jacket.jpg" },
  { id: 4, name: "Beanie Hat", category: "Accessories", price: 9.99, image: "/images/beanie-hat.jpg" },
  { id: 5, name: "Casual Shirt", category: "Shirts", price: 17.99, image: "/images/casual-shirt.jpg" },
  { id: 6, name: "Chino Pants", category: "Pants", price: 24.99, image: "/images/chino-pants.jpg" },
  { id: 7, name: "Winter Jacket", category: "Jackets", price: 79.99, image: "/images/winter-jacket.jpg" },
  { id: 8, name: "Leather Belt", category: "Accessories", price: 14.99, image: "/images/leather-belt.jpg" },
  { id: 9, name: "Formal Shirt", category: "Shirts", price: 22.99, image: "/images/formal-shirt.jpg" },
  { id: 10, name: "Cargo Pants", category: "Pants", price: 27.99, image: "/images/cargo-pants.jpg" },
  { id: 11, name: "Rain Jacket", category: "Jackets", price: 69.99, image: "/images/rain-jacket.jpg" },
  { id: 12, name: "Wool Scarf", category: "Accessories", price: 19.99, image: "/images/wool-scarf.jpg" },
  { id: 13, name: "Graphic Tee", category: "Shirts", price: 15.99, image: "/images/graphic-tee.jpg" },
  { id: 14, name: "Slim Fit Pants", category: "Pants", price: 26.99, image: "/images/slim-fit-pants.jpg" },
  { id: 15, name: "Denim Jacket", category: "Jackets", price: 59.99, image: "/images/denim-jacket.jpg" },
  { id: 16, name: "Baseball Cap", category: "Accessories", price: 12.99, image: "/images/baseball-cap.jpg" },
  { id: 17, name: "Polo Shirt", category: "Shirts", price: 20.99, image: "/images/polo-shirt.jpg" },
  { id: 18, name: "Jogger Pants", category: "Pants", price: 23.99, image: "/images/jogger-pants.jpg" },
  { id: 19, name: "Bomber Jacket", category: "Jackets", price: 69.99, image: "/images/bomber-jacket.jpg" },
  { id: 20, name: "Leather Gloves", category: "Accessories", price: 24.99, image: "/images/leather-gloves.jpg" },
  { id: 21, name: "Henley Shirt", category: "Shirts", price: 18.99, image: "/images/henley-shirt.jpg" },
  { id: 22, name: "Sweatpants", category: "Pants", price: 21.99, image: "/images/sweatpants.jpg" },
  { id: 23, name: "Trench Coat", category: "Jackets", price: 89.99, image: "/images/trench-coat.jpg" },
  { id: 24, name: "Beanie", category: "Accessories", price: 11.99, image: "/images/beanie.jpg" },
  { id: 25, name: "Oxford Shirt", category: "Shirts", price: 25.99, image: "/images/oxford-shirt.jpg" },
  { id: 26, name: "Khaki Pants", category: "Pants", price: 28.99, image: "/images/khaki-pants.jpg" },
  { id: 27, name: "Peacoat", category: "Jackets", price: 99.99, image: "/images/peacoat.jpg" },
  { id: 28, name: "Sunglasses", category: "Accessories", price: 29.99, image: "/images/sunglasses.jpg" },
  { id: 29, name: "Turtleneck", category: "Shirts", price: 22.99, image: "/images/turtleneck.jpg" },
  { id: 30, name: "Sweater", category: "Pants", price: 24.99, image: "/images/sweater.jpg" },
];

function Sidebar({ categories, selectedCategories, setSelectedCategories }) {
  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <aside className="w-64 bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Category</h2>
      <ul>
        {categories.map((cat) => (
          <li key={cat.name} className="mb-3">
            {cat.subcategories ? (
              <>
                <div className="font-semibold mb-1">{cat.name}</div>
                <ul className="pl-4 space-y-1">
                  {cat.subcategories.map((sub) => (
                    <li key={sub.name} className="flex items-center">
                      <input
                        type="checkbox"
                        id={sub.name}
                        checked={selectedCategories.includes(sub.name)}
                        onChange={() => toggleCategory(sub.name)}
                        className="mr-2"
                      />
                      <label htmlFor={sub.name} className="cursor-pointer">
                        {sub.name}
                      </label>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={cat.name}
                  checked={selectedCategories.includes(cat.name)}
                  onChange={() => toggleCategory(cat.name)}
                  className="mr-2"
                />
                <label htmlFor={cat.name} className="cursor-pointer">
                  {cat.name}
                </label>
              </div>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}

import { FaStar } from "react-icons/fa";

function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center text-yellow-400 text-sm">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className="w-4 h-4 fill-current" />
      ))}
      {halfStar && (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-grad">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#half-grad)" d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.561-.955L10 0l2.949 5.955 6.561.955-4.755 4.635 1.123 6.545z" />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <FaStar key={`empty-${i}`} className="w-4 h-4 fill-gray-300" />
      ))}
    </div>
  );
}

import Link from "next/link";

function Card({ product }) {
  return (
    <Link href={`/shop/${product.id}`} className="block">
      <div className="bg-white rounded-lg shadow p-4 flex flex-col h-96 hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-contain rounded"
          />
          <span className="absolute top-2 right-2 bg-gray-200 text-xs px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
        <h3 className="mt-2 font-semibold">{product.name}</h3>
        <StarRating rating={product.rating || 5} />
        <p className="text-sm text-gray-500">{product.reviews || "No Reviews"}</p>
        <p className="mt-1 font-bold">${product.price.toFixed(2)}</p>
        <div className="mt-auto flex space-x-2">
          <Button variant="outline" className="flex-1">
            Add to Cart
          </Button>
          <Button className="flex-1">Buy Now</Button>
        </div>
      </div>
    </Link>
  );
}

export default function ShopPage() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products
    .filter((p) =>
      selectedCategories.length === 0 ? true : selectedCategories.includes(p.category)
    )
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 30);

  return (
    <>
      <main className="container mx-auto px-12 py-8 flex space-x-9 mt-20">
        <Sidebar
          categories={categories}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
        <section className="flex-1">
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <div className="grid grid-cols-3 gap-6 mt-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
