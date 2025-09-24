"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "../../../components/ui/button";
import { getPakaian, getKategoriPakaian } from "../../../lib/api";
import { isAuthenticated } from "../../../lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaStar, FaShoppingCart, FaTshirt, FaHatCowboy, FaUserTie, FaChevronDown, FaSearch } from "react-icons/fa";
import AuthButton from "../../../components/auth/AuthButton";

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

function Sidebar({ categories, selectedCategories, setSelectedCategories, products }) {
  const [expanded, setExpanded] = useState(true);

  // Remove duplicates based on kategori_pakaian_id and sort alphabetically
  const uniqueCategories = categories.filter((category, index, self) =>
    index === self.findIndex((c) => c.kategori_pakaian_id === category.kategori_pakaian_id)
  );
  const sortedCategories = uniqueCategories.sort((a, b) => {
    const nameA = a.kategori_pakaian_nama || '';
    const nameB = b.kategori_pakaian_nama || '';
    return nameA.localeCompare(nameB);
  });

  // Calculate product count for each category and filter out categories with 0 products
  const categoryCounts = sortedCategories
    .map((cat) => {
      const count = products.filter((p) => p.kategori?.id === cat.kategori_pakaian_id).length;
      return { ...cat, count };
    })
    .filter((cat) => cat.count > 0)
    .slice(0, 10); // Limit to 10 categories

  const toggleCategory = (categoryId) => {
    if (validSelectedCategories.includes(categoryId)) {
      setSelectedCategories(validSelectedCategories.filter((c) => c !== categoryId));
    } else {
      setSelectedCategories([...validSelectedCategories, categoryId]);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
  };

  // Filter selectedCategories to only include available categories
  const availableCategoryIds = categoryCounts.map((cat) => cat.kategori_pakaian_id);
  const validSelectedCategories = selectedCategories.filter((id) => availableCategoryIds.includes(id));

  return (
    <aside className="w-64 bg-white rounded-lg shadow p-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-lg font-semibold mb-4"
      >
        Category
        <FaChevronDown className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <>
          {selectedCategories.length > 0 && (
            <div className="mb-4">
              <Button onClick={clearFilters} variant="outline" size="sm" className="w-full">
                Clear Filters
              </Button>
            </div>
          )}
          <ul>
            {categoryCounts.map((cat) => (
              <li key={cat.kategori_pakaian_id} className="mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={cat.kategori_pakaian_id}
                      checked={selectedCategories.includes(cat.kategori_pakaian_id)}
                      onChange={() => toggleCategory(cat.kategori_pakaian_id)}
                      className="mr-2"
                    />
                    <label htmlFor={cat.kategori_pakaian_id} className="cursor-pointer">
                      {cat.kategori_pakaian_nama}
                    </label>
                  </div>
                  <span className="text-sm text-gray-500">({cat.count})</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  );
}

function Card({ product }) {
  const router = useRouter();

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));

    // Dispatch cart update event for header notification
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const buyNow = () => {
    addToCart();
    router.push(`/shop/${product.id}`);
  };

  return (
    <Link href={`/shop/${product.id}`} className="block">
      <div className="bg-white rounded-lg shadow p-4 flex flex-col h-100 hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <img
            src={product.gambar_url || '/placeholder.jpg'}
            alt={product.nama}
            className="w-full h-55 object-contain rounded"
          />
          <span className="absolute top-2 right-2 bg-gray-200 text-xs px-2 py-1 rounded">
            {product.kategori?.nama || 'No Category'}
          </span>
        </div>
        <h3 className="mt-2 font-semibold text-black">{product.nama}</h3>
        <p className="mt-1 font-bold text-black">Rp {parseInt(product.harga).toLocaleString()}</p>
        <div className="mt-2 flex items-center">
          <StarRating rating={4} />
          <span className="ml-2 text-sm text-gray-600">4.0 (10 reviews)</span>
        </div>
        <div className="mt-4 flex space-x-2">
           <Button variant="outline" className="flex-1 border border-gray-300 bg-white text-gray-900 py-2 px-4 rounded hover:bg-gray-50 transition-colors" onClick={(e) => { e.preventDefault(); addToCart(); }}>
                      Add to Cart
                    </Button>
                    <Button className="flex-1 bg-gray-950 text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors" onClick={(e) => { e.preventDefault(); buyNow(); }}>Buy Now</Button>
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

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const productsPerPage = 9;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = debouncedSearchTerm ? { search: debouncedSearchTerm } : {};
        const [pakaianRes, kategoriRes] = await Promise.all([
          getPakaian(params),
          getKategoriPakaian()
        ]);
        // Handle both direct arrays and paginated responses
        const productsData = Array.isArray(pakaianRes) ? pakaianRes : (pakaianRes?.data || []);
        const categoriesData = Array.isArray(kategoriRes) ? kategoriRes : (kategoriRes?.data || []);

        setProducts(productsData);
        setCategories(categoriesData);
        setCurrentPage(1); // Reset to first page on search
      } catch (error) {
        console.error('Error fetching data:', error);
        setProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [debouncedSearchTerm]);

  // Filter selectedCategories to only include available categories
  const availableCategoryIds = categories
    .filter((category, index, self) =>
      index === self.findIndex((c) => c.kategori_pakaian_id === category.kategori_pakaian_id)
    )
    .sort((a, b) => {
      const nameA = a.kategori_pakaian_nama || '';
      const nameB = b.kategori_pakaian_nama || '';
      return nameA.localeCompare(nameB);
    })
    .map((cat) => {
      const count = products.filter((p) => p.kategori?.id === cat.kategori_pakaian_id).length;
      return { ...cat, count };
    })
    .filter((cat) => cat.count > 0)
    .slice(0, 10)
    .map((cat) => cat.kategori_pakaian_id);

  const validSelectedCategories = selectedCategories.filter((id) => availableCategoryIds.includes(id));

  const filteredProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];

    return validSelectedCategories.length === 0
      ? products
      : products.filter((p) => p.kategori?.id && validSelectedCategories.includes(p.kategori.id));
  }, [products, validSelectedCategories]);

  const totalPages = Math.ceil((filteredProducts?.length || 0) / productsPerPage);

  const displayedProducts = useMemo(() => {
    if (!filteredProducts || !Array.isArray(filteredProducts)) return [];
    return filteredProducts.slice(
      (currentPage - 1) * productsPerPage,
      currentPage * productsPerPage
    );
  }, [filteredProducts, currentPage, productsPerPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Show loading state
  if (loading) {
    return <div className="text-center py-8 mt-20">Loading...</div>;
  }

  // Ensure products are loaded before rendering
  if (!products || !Array.isArray(products)) {
    return <div className="text-center py-8 mt-20">Loading products...</div>;
  }

  return (
    <div className={`container mx-auto px-12 py-8 ${showSidebar ? 'flex space-x-9' : ''} mt-20`}>
      {showSidebar && (
        <Sidebar
          categories={categories}
          selectedCategories={validSelectedCategories}
          setSelectedCategories={(cats) => {
            setSelectedCategories(cats);
            setCurrentPage(1);
          }}
          products={products}
        />
      )}

      <section className="flex-1">
        <div className="mb-4 flex items-center justify-between">
          <Button onClick={() => setShowSidebar(!showSidebar)} variant="outline">
            {showSidebar ? 'Hide Filters' : 'Show Filters'}
          </Button>

          {/* Search Input */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent w-64"
            />
          </div>
        </div>

        {displayedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found.</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </section>
    </div>
  );
}
