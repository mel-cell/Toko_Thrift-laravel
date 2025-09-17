import React, { useRef } from "react";
import { Button } from "../../../ui/button";

const products = [
  {
    id: 1,
    name: "TWS Bujug",
    category: "Other",
    rating: 5.0,
    reviews: "1.2k Reviews",
    price: 29.9,
    image: "/images/tws-bujug.jpg",
  },
  {
    id: 2,
    name: "Headsound Baptis",
    category: "Music",
    rating: 5.0,
    reviews: "1.2k Reviews",
    price: 12.0,
    image: "/images/headsound-baptis.jpg",
  },
  {
    id: 3,
    name: "Adudu Cleaner",
    category: "Other",
    rating: 4.4,
    reviews: "1k Reviews",
    price: 29.9,
    image: "/images/adudu-cleaner.jpg",
  },
  {
    id: 4,
    name: "Adudu Cleaner",
    category: "Other",
    rating: 4.4,
    reviews: "1k Reviews",
    price: 29.9,
    image: "/images/adudu-cleaner.jpg",
  },
];

function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center text-yellow-400 text-sm">
      {[...Array(fullStars)].map((_, i) => (
        <svg key={`full-${i}`} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.561-.955L10 0l2.949 5.955 6.561.955-4.755 4.635 1.123 6.545z" />
        </svg>
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
        <svg key={`empty-${i}`} className="w-4 h-4 fill-gray-300" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.561-.955L10 0l2.949 5.955 6.561.955-4.755 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  );
}

export default function RecommendationProduct() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-[30px] font-semibold mb-4">Explore our recommendations</h2>
      <div className="relative">
        <button
          aria-label="Scroll Left"
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 shadow hover:bg-gray-300 z-10"
        >
          &#8592;
        </button>
        <div
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {products.map((product) => (
            <div key={product.id} className="min-w-[420px] bg-white rounded-lg shadow p-4 flex-shrink-0 h-100 flex flex-col">
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
              <StarRating rating={product.rating} />
              <p className="text-sm text-gray-500">{product.reviews}</p>
              <p className="mt-1 font-bold">${product.price.toFixed(2)}</p>
              <div className="mt-auto flex space-x-2">
                <Button variant="outline" className="flex-1">
                  Add to Cart
                </Button>
                <Button className="flex-1">
                  Buy Now
                </Button>
              </div>
            </div>
          ))}
        </div>
        <button
          aria-label="Scroll Right"
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 shadow hover:bg-gray-300 z-10"
        >
          &#8594;
        </button>
      </div>
    </section>
  );
}
