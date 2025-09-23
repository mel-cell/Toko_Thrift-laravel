"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { createPembelian, getMetodePembayaran } from "../lib/api";
import { isAuthenticated } from "../lib/auth";
import { useRouter } from "next/navigation";

function PurchaseModal({ isOpen, onClose, product, quantity = 1, cartItems = null, onPurchaseComplete }) {
  const [formData, setFormData] = useState({
    alamat: '',
    metode_pembayaran_id: '',
    catatan: ''
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [availablePaymentTypes] = useState([
    { value: 'DANA', label: 'DANA', type: 'digital' },
    { value: 'OVO', label: 'OVO', type: 'digital' },
    { value: 'BCA', label: 'BCA', type: 'bank' },
    { value: 'COD', label: 'Cash on Delivery (COD)', type: 'cash' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      fetchPaymentMethods();
    }
  }, [isOpen]);

  const fetchPaymentMethods = async () => {
    try {
      const methods = await getMetodePembayaran();
      setPaymentMethods(Array.isArray(methods) ? methods : []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      setPaymentMethods([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    if (cartItems && cartItems.length > 0) {
      // Cart purchase - sum all items
      return cartItems.reduce((total, item) => {
        return total + (parseInt(item.harga || 0) * parseInt(item.quantity || 1));
      }, 0);
    } else {
      // Single product purchase
      const price = parseInt(product?.harga || 0);
      const qty = parseInt(quantity || 1);
      return price * qty;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    if (!formData.alamat || !formData.metode_pembayaran_id) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      let pembelianData;

      if (cartItems && cartItems.length > 0) {
        // Cart purchase
        pembelianData = {
          user_id: user.id,
          alamat: formData.alamat,
          metode_pembayaran_id: parseInt(formData.metode_pembayaran_id),
          catatan: formData.catatan,
          items: cartItems.map(item => ({
            pakaian_id: item.id,
            jumlah: item.quantity,
            harga_satuan: item.harga
          }))
        };

        // Clear entire cart
        localStorage.setItem('cart', JSON.stringify([]));
      } else {
        // Single product purchase
        pembelianData = {
          user_id: user.id,
          alamat: formData.alamat,
          metode_pembayaran_id: parseInt(formData.metode_pembayaran_id),
          catatan: formData.catatan,
          items: [{
            pakaian_id: product.id,
            jumlah: quantity,
            harga_satuan: product.harga
          }]
        };

        // Clear cart if this was a direct purchase
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const updatedCart = cart.filter(item => item.id !== product.id);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }

      const response = await createPembelian(pembelianData);

      // Dispatch cart update event
      window.dispatchEvent(new Event('cartUpdated'));

      // Close modal and call completion handler
      onClose();
      if (onPurchaseComplete) {
        onPurchaseComplete();
      } else {
        router.push('/orders');
      }

    } catch (error) {
      console.error('Error creating purchase:', error);
      setError('Failed to create purchase. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 border-lg bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Complete Your Purchase</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Product Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-lg mb-3">Order Summary</h3>

            {cartItems && cartItems.length > 0 ? (
              // Cart Summary
              <div className="space-y-3">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <img
                      src={item.gambar_url || '/placeholder.jpg'}
                      alt={item.nama}
                      className="w-16 h-16 object-contain rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.nama}</h4>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm font-medium text-blue-600">
                        Rp {parseInt(item.harga || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        Rp {(parseInt(item.harga || 0) * parseInt(item.quantity || 1)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total ({cartItems.length} items)</span>
                    <span className="text-green-600">Rp {calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              // Single Product Summary
              <div className="flex items-center space-x-4">
                <img
                  src={product?.gambar_url || '/placeholder.jpg'}
                  alt={product?.nama}
                  className="w-20 h-20 object-contain rounded"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{product?.nama}</h4>
                  <p className="text-gray-600">Quantity: {quantity}</p>
                  <p className="text-lg font-bold text-blue-600">
                    Rp {parseInt(product?.harga || 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-xl font-bold text-green-600">
                    Rp {calculateTotal().toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Purchase Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Address *
              </label>
              <textarea
                name="alamat"
                value={formData.alamat}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your complete delivery address"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method *
              </label>
              <select
                name="metode_pembayaran_id"
                value={formData.metode_pembayaran_id}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select payment method</option>

                {/* User's Saved Payment Methods */}
                {paymentMethods.length > 0 && (
                  <optgroup label="💾 Your Saved Payment Methods">
                    {paymentMethods.map((method) => (
                      <option key={method.metode_pembayaran_id} value={method.metode_pembayaran_id}>
                        {method.metode_pembayaran_jenis} - {method.metode_pembayaran_nomor || 'No account number'}
                      </option>
                    ))}
                  </optgroup>
                )}

                {/* Available Payment Types */}
                <optgroup label="Available Payment Methods">
                  {availablePaymentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </optgroup>
              </select>

              {/* Account Number Display */}
              {formData.metode_pembayaran_id && (() => {
                // Check if it's a saved payment method
                const selectedMethod = paymentMethods.find(m => m.metode_pembayaran_id === formData.metode_pembayaran_id);
                // Check if it's an available payment type
                const selectedType = availablePaymentTypes.find(t => t.value === formData.metode_pembayaran_id);

                if (selectedMethod && selectedMethod.metode_pembayaran_jenis !== 'COD' && selectedMethod.metode_pembayaran_nomor) {
                  return (
                    <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-blue-800">
                            <strong>Account Number:</strong> {selectedMethod.metode_pembayaran_nomor}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            Please transfer to this {selectedMethod.metode_pembayaran_jenis} account to complete your purchase
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                } else if (selectedType && selectedType.type !== 'cash') {
                  return (
                    <div className="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-yellow-800">
                            <strong>Payment Method:</strong> {selectedType.label}
                          </p>
                          <p className="text-xs text-yellow-600 mt-1">
                            Please prepare your {selectedType.label} account for payment
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                name="catatan"
                value={formData.catatan}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any special instructions or notes"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Processing...' : `Complete Purchase - Rp ${calculateTotal().toLocaleString()}`}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PurchaseModal;
