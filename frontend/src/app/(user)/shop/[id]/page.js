"use client";

import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const products = [
  {
    id: 1,
    name: "Nike Air Force 1 '07",
    category: "Running Shoes",
    rating: 4.5,
    reviews: "2.5K Reviews",
    description:
      "Classic and comfortable, you'll want to wear these AF-1s time after time. Smooth suede and a plush collar give these kicks a premium feel, while the gum sole adds a retro look. Of course, some things never change: Nike Air units still cushion your every step.",
    sizes: [
      "6.5", "7.0", "7.5", "8.0", "8.5", "9.0",
      "9.5", "10.0", "10.5", "11.0", "11.5", "12.0",
      "12.5", "13.0", "14"
    ],
    price: 1400000,
    discount: "15% Discount For Membership",
    discountDetails:
      "Every SEPOKAT membership customers can get 15% discount with minimum $1000 shopping",
    images: [
      "/images/nike-airforce-main.jpg",
      "/images/nike-airforce-1.jpg",
      "/images/nike-airforce-2.jpg",
      "/images/nike-airforce-3.jpg",
    ],
  },
  // Add more products as needed
];

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
          <path
            fill="url(#half-grad)"
            d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.561-.955L10 0l2.949 5.955 6.561.955-4.755 4.635 1.123 6.545z"
          />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <FaStar key={`empty-${i}`} className="w-4 h-4 fill-gray-300" />
      ))}
    </div>
  );
}

export default function ProductDetail({ params }) {
  const { id } = params;
  const product = products.find((p) => p.id === parseInt(id));
  const [selectedSize, setSelectedSize] = useState(product?.sizes[4] || "");
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <div className="p-8 text-center">Product not found.</div>;
  }

  return (
    <main className="container mx-auto px-12 py-8 mt-20 flex space-x-12">
      {/* Left Images */}
      <div className="flex flex-col space-y-4 w-1/2">
        <img
          src={product.images[0]}
          alt={product.name}
          className="rounded-lg object-contain w-full h-96"
        />
        <div className="flex space-x-4">
          {product.images.slice(1).map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${product.name} ${idx + 1}`}
              className="rounded-lg object-contain w-24 h-24 cursor-pointer border border-gray-300"
            />
          ))}
        </div>
      </div>

      {/* Right Details */}
      <div className="flex-1">
        <p className="text-sm text-gray-600">{product.category} / Running Shoes</p>
        <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
        <div className="flex items-center space-x-2 mt-1">
          <StarRating rating={product.rating} />
          <span className="text-sm text-gray-600">{product.reviews}</span>
        </div>

        {/* Tags */}
        <div className="flex space-x-2 mt-3">
          <span className="px-3 py-1 bg-gray-200 rounded-full text-xs">Running Shoes</span>
          <span className="px-3 py-1 bg-gray-200 rounded-full text-xs">Casual Sneakers</span>
          <span className="px-3 py-1 bg-gray-200 rounded-full text-xs">Limited Edition</span>
        </div>

        {/* Description */}
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">Product Description</h2>
          <p className="text-gray-700">{product.description}</p>
        </div>

        {/* Size Chart */}
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">Size Chart</h2>
          <div className="flex space-x-2 flex-wrap">
            {product.sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-full border ${
                    isSelected ? "bg-black text-white border-black" : "bg-gray-200 border-transparent"
                  } text-sm mb-2`}
                  aria-pressed={isSelected}
                  type="button"
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity */}
        <div className="mt-6 flex items-center space-x-4">
          <h2 className="font-semibold text-lg">Item Quantity</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              -
            </button>
            <span className="px-4 py-1 border rounded">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              +
            </button>
          </div>
        </div>

        {/* Price and Discount */}
        <div className="mt-6">
          <p className="text-2xl font-bold">
            IDR {product.price.toLocaleString("id-ID")}
          </p>
          <p className="mt-2 px-4 py-2 bg-gray-100 rounded text-sm text-gray-700">
            <strong>{product.discount}</strong>
            <br />
            {product.discountDetails}
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex space-x-4">
          <Button variant="default" size="default" className="flex-1">
            Buy Now
          </Button>
          <Button variant="outline" size="default" className="flex-1">
            Add To Cart
          </Button>
        </div>

        {/* Collapsible Sections */}
        <details className="mt-6 border-t border-gray-300 pt-4">
          <summary className="cursor-pointer font-semibold">Reviews</summary>
          <p className="mt-2 text-gray-700">No reviews yet.</p>
        </details>
        <details className="mt-4 border-t border-gray-300 pt-4">
          <summary className="cursor-pointer font-semibold">Shipping Method</summary>
          <p className="mt-2 text-gray-700">Standard shipping available.</p>
        </details>
      </div>
    </main>
  );
}
