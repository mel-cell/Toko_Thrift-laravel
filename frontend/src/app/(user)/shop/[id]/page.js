"use client";

import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { getPakaianById } from "../../../../lib/api";
import PurchaseModal from "@/components/PurchaseModal";
import RelatedProducts from "@/components/RelatedProducts";
import { isAuthenticated } from "../../../../lib/auth";
import { useRouter } from "next/navigation";
import AuthButton from "@/components/auth/AuthButton";

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
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const router = useRouter();

  const handleAddToCart = () => {
    // Add to cart logic here
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity: quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    alert('Added to cart!');
  };

  const handleBuyNow = () => {
    setShowPurchaseModal(true);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Handle both sync and async params for compatibility
        const resolvedParams = params instanceof Promise ? await params : params;
        const data = await getPakaianById(resolvedParams.id);
        setProduct(data);
        setSelectedSize(data.size); // Default to product's size
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params]);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!product) {
    return <div className="p-8 text-center">Product not found.</div>;
  }

  return (
    <>
      {/* Product Detail Section */}
      <main className="container mx-auto px-12 py-8 mt-20 flex space-x-12">
        {/* Left Images */}
        <div className="flex flex-col space-y-4 w-1/2">
          <img
            src={product.gambar_url || '/placeholder.jpg'}
            alt={product.nama}
            className="rounded-lg object-contain w-full h-96"
          />
        </div>

        {/* Right Details */}
        <div className="flex-1">
          <p className="text-sm text-gray-600">{product.kategori?.nama || 'No Category'}</p>
          <h1 className="text-3xl font-bold mt-1">{product.nama}</h1>

          {/* Description */}
          <div className="mt-6">
            <h2 className="font-semibold text-lg mb-2">Product Description</h2>
            <p className="text-gray-700">{product.deskripsi || 'No description available'}</p>
          </div>

          {/* Size */}
          <div className="mt-6">
            <h2 className="font-semibold text-lg mb-2">Size</h2>
            <p className="text-gray-700">{product.size || 'No size specified'}</p>
          </div>

          {/* Quantity */}
          <div className="mt-6 flex items-center space-x-4">
            <h2 className="font-semibold text-lg">Item Quantity</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <span className="px-4 py-1 border rounded min-w-[50px] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stok, quantity + 1))}
                disabled={quantity >= product.stok}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-600">
              (Max: {product.stok} available)
            </span>
          </div>

          {/* Price */}
          <div className="mt-6">
            <p className="text-2xl font-bold">
              Rp {parseInt(product.harga).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Stock: {product.stok}</p>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex space-x-4">
            <AuthButton
              className="flex-1 bg-gray-950 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              onClick={handleBuyNow}
              requireAuth={true}
              fallbackText="Login to Buy"
            >
              Buy Now
            </AuthButton>
            <AuthButton
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              onClick={handleAddToCart}
              requireAuth={true}
              fallbackText="Login to Add"
            >
              Add To Cart
            </AuthButton>
          </div>

          {/* Additional Product Information */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Product Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Product ID:</span> {product.id}
              </div>
              <div>
                <span className="font-medium">Category:</span> {product.kategori?.nama}
              </div>
              <div>
                <span className="font-medium">Size:</span> {product.size}
              </div>
              <div>
                <span className="font-medium">Stock:</span> {product.stok} units
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Shipping Information</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Free shipping for orders above Rp 100,000</li>
              <li>• Delivery within 3-5 business days</li>
              <li>• Cash on delivery available</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Custom Reviews Section */}
      <section className="py-12">
        <div className="container mx-auto px-12">
          <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center mb-4">
              <StarRating rating={4.5} />
              <span className="ml-3 text-lg font-semibold">4.5 out of 5</span>
              <span className="ml-2 text-sm text-gray-600">(24 reviews)</span>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center mb-2">
                  <span className="font-semibold">John D.</span>
                  <StarRating rating={5} />
                </div>
                <p className="text-gray-700">
                  "Excellent quality! The material feels premium and the fit is perfect.
                  Will definitely buy again."
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <div className="flex items-center mb-2">
                  <span className="font-semibold">Sarah M.</span>
                  <StarRating rating={4} />
                </div>
                <p className="text-gray-700">
                  "Great product overall. Fast shipping and good customer service.
                  Minor sizing issue but was resolved quickly."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-12">
          <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
          <RelatedProducts />
        </div>
      </section>

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        product={product}
        quantity={quantity}
      />
    </>
  );
}
