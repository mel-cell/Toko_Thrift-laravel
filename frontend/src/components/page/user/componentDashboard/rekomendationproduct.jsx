import React, { useRef, useState, useEffect } from "react";
import { Button } from "../../../ui/button";
import AuthButton from "../../../auth/AuthButton";
import { getPakaian } from "../../../../lib/api";
import { isAuthenticated } from "../../../../lib/auth";
import { useRouter } from "next/navigation";

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

function ProductCard({ product }) {
  const router = useRouter();

  const addToCart = () => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
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
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    addToCart();
    router.push(`/shop/${product.id}`);
  };

  return (
    <div className="min-w-[420px] bg-white rounded-lg shadow p-4 flex-shrink-0 h-100 flex flex-col">
      <div className="relative">
        <img
          src={product.gambar_url || '/placeholder.jpg'}
          alt={product.nama}
          className="w-full h-48 object-contain rounded"
        />
        <span className="absolute top-2 right-2 bg-gray-200 text-xs px-2 py-1 rounded">
          {product.kategori?.nama || 'No Category'}
        </span>
      </div>
      <h3 className="mt-2 font-semibold">{product.nama}</h3>
      <StarRating rating={4} />
      <p className="text-sm text-gray-500">4.0 (10 reviews)</p>
      <p className="mt-1 font-bold">Rp {parseInt(product.harga).toLocaleString()}</p>
      <div className="mt-auto flex space-x-2">
        <AuthButton
          className="flex-1 bg-gray-950 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          onClick={buyNow}
          requireAuth={true}
          fallbackText="Login to Buy"
        >
          Buy Now
        </AuthButton>
        <AuthButton
          className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          onClick={addToCart}
          requireAuth={true}
          fallbackText="Login to Add"
        >
          Add To Cart
        </AuthButton>
      </div>
    </div>
  );
}

export default function RecommendationProduct() {
  const scrollRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getPakaian();
        // Get 4 random products
        const shuffled = Array.isArray(data) ? data.sort(() => 0.5 - Math.random()) : [];
        setProducts(shuffled.slice(0, 4));
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-[30px] font-semibold mb-4">Explore our recommendations</h2>
        <div className="flex space-x-6 overflow-x-auto">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="min-w-[420px] bg-white rounded-lg shadow p-4 animate-pulse">
              <div className="h-48 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

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
            <ProductCard key={product.id} product={product} />
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