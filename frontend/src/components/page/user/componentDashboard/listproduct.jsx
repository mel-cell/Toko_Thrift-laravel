import React, { useState } from "react";
import { Button } from "../../../ui/button";
import { FaShoppingCart, FaTshirt, FaHatCowboy, FaUserTie, FaStar } from "react-icons/fa";

const categories = [
  {
    name: "Clothing",
    icon: <FaTshirt className="inline mr-2" />,
    subcategories: [
      { name: "Shirts", icon: <FaTshirt className="inline mr-2" /> },
      { name: "Pants", icon: <FaUserTie className="inline mr-2" /> },
      { name: "Jackets", icon: <FaHatCowboy className="inline mr-2" /> },
      { name: "Accessories", icon: <FaStar className="inline mr-2" /> },
    ],
  },
  {
    name: "New Arrival",
    icon: <FaStar className="inline mr-2" />,
  },
  {
    name: "Best Seller",
    icon: <FaStar className="inline mr-2" />,
  },
  {
    name: "On Discount",
    icon: <FaStar className="inline mr-2" />,
  },
];

const products = [
  {
    id: 1,
    name: "Classic Shirt",
    category: "Shirts",
    rating: 4.5,
    reviews: "150 Reviews",
    price: 19.99,
    image: "/images/classic-shirt.jpg",
  },
  {
    id: 2,
    name: "Denim Pants",
    category: "Pants",
    rating: 4.7,
    reviews: "200 Reviews",
    price: 29.99,
    image: "/images/denim-pants.jpg",
  },
  {
    id: 3,
    name: "Leather Jacket",
    category: "Jackets",
    rating: 4.8,
    reviews: "180 Reviews",
    price: 59.99,
    image: "/images/leather-jacket.jpg",
  },
  {
    id: 4,
    name: "Beanie Hat",
    category: "Accessories",
    rating: 4.2,
    reviews: "90 Reviews",
    price: 9.99,
    image: "/images/beanie-hat.jpg",
  },
  {
    id: 5,
    name: "Casual Shirt",
    category: "Shirts",
    rating: 4.3,
    reviews: "120 Reviews",
    price: 17.99,
    image: "/images/casual-shirt.jpg",
  },
  {
    id: 6,
    name: "Chino Pants",
    category: "Pants",
    rating: 4.6,
    reviews: "140 Reviews",
    price: 24.99,
    image: "/images/chino-pants.jpg",
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
                <div className="font-semibold mb-1 flex items-center">
                  {cat.icon}
                  <span>{cat.name}</span>
                </div>
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
                      <label htmlFor={sub.name} className="cursor-pointer flex items-center">
                        {sub.icon}
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
                <label htmlFor={cat.name} className="cursor-pointer flex items-center">
                  {cat.icon}
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
        <StarRating rating={product.rating} />
        <p className="text-sm text-gray-500">{product.reviews}</p>
        <p className="mt-1 font-bold">${product.price.toFixed(2)}</p>
        <div className="mt-4 flex space-x-2">
          <Button variant="outline" className="flex-1">
            Add to Cart
          </Button>
          <Button className="flex-1">Buy Now</Button>
        </div>
      </div>
    </Link>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    if (i <= 3 || i === totalPages) {
      pageNumbers.push(i);
    } else if (i === 4) {
      pageNumbers.push("...");
    }
  }

  return (
    <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="hover:underline disabled:opacity-50"
      >
        Previous
      </button>
      <div>
        {pageNumbers.map((num, idx) =>
          num === "..." ? (
            <span key={idx} className="mx-1">
              ...
            </span>
          ) : (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              className={`px-2 py-1 rounded mr-1 ${
                currentPage === num ? "bg-gray-200" : "hover:bg-gray-200"
              }`}
            >
              {num}
            </button>
          )
        )}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="hover:underline disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

export default function ListProduct() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  const filteredProducts =
    selectedCategories.length === 0
      ? products
      : products.filter((p) => selectedCategories.includes(p.category));

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="flex space-x-9 container mx-auto px-12 py-8">
      <Sidebar
        categories={categories}
        selectedCategories={selectedCategories}
        setSelectedCategories={(cats) => {
          setSelectedCategories(cats);
          setCurrentPage(1);
        }}
      />

      <section className="flex-1">
        <div className="grid grid-cols-3 gap-6">
          {displayedProducts.map((product) => (
            <Card key={product.id} product={product} />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </section>
    </div>
  );
}
